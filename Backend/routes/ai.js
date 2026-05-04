// // const express = require("express");
// // const crypto = require("crypto");
// // const { z } = require("zod");
// // const { collections } = require("../config/db");
// // const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
// // const { Chroma } = require("@langchain/community/vectorstores/chroma");
// // const { HumanMessage, AIMessage } = require("@langchain/core/messages");
// // const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
// // const fs = require("fs");
// // const path = require("path");
// // const PDFParser = require("pdf2json");

// // // Extracts plain text from a PDF Buffer using pdf2json
// // function extractPdfText(buffer) {
// //     return new Promise((resolve, reject) => {
// //         const parser = new PDFParser(null, 1);
// //         parser.on("pdfParser_dataReady", (data) => {
// //             try {
// //                 const text = data.Pages
// //                     .map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" "))
// //                     .join("\n");
// //                 resolve(text);
// //             } catch (e) { reject(e); }
// //         });
// //         parser.on("pdfParser_dataError", (err) => reject(new Error(err.parserError || err)));
// //         parser.parseBuffer(buffer);
// //     });
// // }
// // const multer = require("multer");
// // const { processAndEmbedPdf } = require("../utils/aiHelper");
// // const { OPENAI_API_KEY, UPLOAD_DIR } = require("../config/config");

// // const storage = multer.memoryStorage();
// // const quizUpload = multer({ storage });

// // const router = express.Router();

// // router.get("/test", (req, res) => res.json({ success: true }));

// // router.get("/debug/chroma", async (req, res) => {
// //     try {
// //         const response = await fetch("http://127.0.0.1:8000/api/v2/heartbeat");
// //         const data = await response.json();
// //         res.json({ status: "connected", heartbeat: data });
// //     } catch (err) {
// //         res.status(500).json({ status: "disconnected", error: err.message });
// //     }
// // });

// // router.get("/debug/collection/:course", async (req, res) => {
// //     try {
// //         const collectionName = req.params.course.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
// //         const response = await fetch(`http://127.0.0.1:8000/api/v1/collections/${collectionName}/count`);
// //         const data = await response.json();
// //         res.json({ collection: collectionName, count: data });
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // });

// // function getVectorStore(courseName) {
// //     const collectionName = courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
// //     return new Chroma(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }), {
// //         collectionName,
// //         url: "http://127.0.0.1:8000"
// //     });
// // }

// // // ─────────────────────────────────────────────
// // // Persistent Chat Route
// // // ─────────────────────────────────────────────
// // router.post("/chat/:course", async (req, res) => {
// //     try {
// //         const { question, studentId = "anonymous", chatId } = req.body || {};
// //         const courseName = req.params.course;

// //         if (!question) return res.status(400).json({ error: "question required" });
// //         if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

// //         // Generate or reuse chatId
// //         const currentChatId = chatId || crypto.randomUUID();

// //         // 1. Fetch chat history from MongoDB
// //         const chatDoc = await collections.chats().findOne({ chatId: currentChatId });
// //         let messagesHistory = [];
// //         if (chatDoc && chatDoc.messages) {
// //             messagesHistory = chatDoc.messages.map(msg =>
// //                 msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
// //             );
// //         }

// //         // 2. Fetch context from DB
// //         const vectorStore = getVectorStore(courseName);
// //         const docs = await vectorStore.similaritySearch(question, 4);
// //         const contextStr = docs.map(d => d.pageContent).join("\n\n");

// //         // 3. Build the prompt with memory
// //         const prompt = ChatPromptTemplate.fromMessages([
// //             ["system", `You are a helpful AI tutor for the course '{course}'. 
// //             Answer the student's question based strictly on the provided context below.
// //             If the context is insufficient, tell them to consult the instructor.

// //             Context: {context}`],
// //             new MessagesPlaceholder("history"),
// //             ["human", "{question}"]
// //         ]);

// //         const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, modelName: "gpt-3.5-turbo", temperature: 0.3 });

// //         // 4. Generate answer
// //         const chain = prompt.pipe(llm);
// //         const response = await chain.invoke({
// //             course: courseName,
// //             context: contextStr,
// //             history: messagesHistory,
// //             question: question
// //         });

// //         const answer = response.content;

// //         // 5. Save back to MongoDB
// //         const newMessages = [
// //             { role: "user", content: question, timestamp: new Date() },
// //             { role: "ai", content: answer, timestamp: new Date() }
// //         ];

// //         await collections.chats().updateOne(
// //             { chatId: currentChatId },
// //             {
// //                 $set: { studentId, courseName, updatedAt: new Date() },
// //                 $setOnInsert: { createdAt: new Date() },
// //                 $push: { messages: { $each: newMessages } }
// //             },
// //             { upsert: true }
// //         );

// //         res.json({ answer, chatId: currentChatId });
// //     } catch (err) {
// //         console.error("Chat error:", err);
// //         res.status(500).json({ error: "Failed to generate AI response" });
// //     }
// // });

// // // GET /api/ai/chats/:studentId/:course
// // router.get("/chats/:studentId/:course", async (req, res) => {
// //     try {
// //         const { studentId, course } = req.params;
// //         const chats = await collections.chats().find({ studentId, courseName: course })
// //             .sort({ updatedAt: -1 })
// //             .project({ chatId: 1, updatedAt: 1, "messages": { $slice: 1 } }) // only get first message for preview
// //             .toArray();
// //         res.json(chats);
// //     } catch (err) {
// //         res.status(500).json({ error: "Internal server error" });
// //     }
// // });

// // // GET /api/ai/chat/:chatId
// // router.get("/chat/:chatId", async (req, res) => {
// //     try {
// //         const chat = await collections.chats().findOne({ chatId: req.params.chatId });
// //         if (!chat) return res.status(404).json({ error: "Chat not found" });
// //         res.json(chat);
// //     } catch (err) {
// //         res.status(500).json({ error: "Internal server error" });
// //     }
// // });

// // // ─────────────────────────────────────────────
// // // AI Quiz Generation Route
// // // ─────────────────────────────────────────────

// // const quizSchema = z.object({
// //     title: z.string().describe("A catchy title for the quiz"),
// //     questions: z.array(z.object({
// //         question: z.string().describe("The quiz question text"),
// //         options: z.array(z.string()).length(4).describe("Four multiple choice options including the correct one"),
// //         answer: z.string().describe("The exact string match of the correct option")
// //     }))
// // });

// // router.post("/generate-quiz/:course", quizUpload.single("pdf"), async (req, res) => {
// //     try {
// //         const courseName = req.params.course;
// //         const {
// //             numQuestions = 5,
// //             difficulty = "medium",
// //             startTime,
// //             endTime,
// //             quizId,
// //             publish = false,       // NEW: if true, immediately make quiz live for students
// //             durationHours = 24     // NEW: how long the quiz stays active when published
// //         } = req.body || {};

// //         if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

// //         let contextStr = "";
// //         let sourceInfo = "Vector DB (Chroma)";

// //         // 🟢 Case A: User uploaded a file specifically for this quiz
// //         if (req.file) {
// //             if (global.addLog) global.addLog(`[Quiz Gen] Direct File detected. Extracting text for instant use...`);
// //             sourceInfo = `Direct Upload: ${req.file.originalname}`;
// //             const pdfData = await extractPdfText(req.file.buffer);
// //             contextStr = pdfData;

// //             // Simultaneously save and embed for the future
// //             try {
// //                 const dir = path.join(UPLOAD_DIR, "resources", courseName);
// //                 if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// //                 const fileName = Date.now() + "_" + req.file.originalname;
// //                 const fullPath = path.join(dir, fileName);
// //                 fs.writeFileSync(fullPath, req.file.buffer);

// //                 await collections.courses().updateOne(
// //                     { name: courseName },
// //                     { $push: { resources: fileName } }
// //                 );
// //                 // Background embedding
// //                 processAndEmbedPdf(courseName, fullPath);
// //             } catch (saveErr) {
// //                 console.error("Failed to save direct quiz file:", saveErr);
// //             }
// //         } 
// //         // 🔵 Case B: Fallback to existing ChromaDB memory
// //         else {
// //             const vectorStore = getVectorStore(courseName);
// //             const docs = await vectorStore.similaritySearch("key topics summary overview concepts definitions", 6);
// //             contextStr = docs.map(d => d.pageContent).join("\n\n");

// //             if (!docs.length) {
// //                 return res.status(400).json({ 
// //                     error: "No course materials found. Please upload a PDF in the 'Upload' section or attach a PDF directly here." 
// //                 });
// //             }
// //         }

// //         // 2. Generate structured quiz
// //         const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, modelName: "gpt-4o-mini", temperature: 0.5 });
// //         const structuredLlm = llm.withStructuredOutput(quizSchema);

// //         const promptTemplate = ChatPromptTemplate.fromTemplate(`
// // You are an expert curriculum designer. Generate a multiple-choice quiz based ONLY on the provided course context.
// // Course Name: {course}
// // Number of Questions: {numQuestions}
// // Difficulty Level: {difficulty}

// // Context: {context}

// // Ensure there are exactly 4 options per question, and the 'answer' field perfectly matches one of the options.
// //         `);

// //         const formattedPrompt = await promptTemplate.format({
// //             course: courseName,
// //             numQuestions,
// //             difficulty,
// //             context: contextStr
// //         });

// //         console.log(`[AI] Generating ${difficulty} quiz with ${numQuestions} questions for ${courseName}...`);

// //         const generatedQuizPayload = await structuredLlm.invoke(formattedPrompt);

// //         // 3. Build the quiz object — apply publish logic here, right after LLM returns schema
// //         const finalQuizId = quizId || generatedQuizPayload.title.replace(/\s+/g, '-').toLowerCase();

// //         // Resolve timing: if publish=true, go live NOW; otherwise, save as draft (far future start)
// //         let resolvedStart, resolvedEnd;
// //         if (publish) {
// //             resolvedStart = new Date();
// //             resolvedEnd = new Date(Date.now() + Number(durationHours) * 60 * 60 * 1000);
// //             if (global.addLog) global.addLog(`[Quiz] Publishing "${generatedQuizPayload.title}" immediately for ${durationHours}h`);
// //         } else if (startTime && endTime) {
// //             resolvedStart = new Date(startTime);
// //             resolvedEnd = new Date(endTime);
// //         } else {
// //             // Draft: start time is 100 years in future so it won't appear as active
// //             resolvedStart = new Date("2100-01-01T00:00:00Z");
// //             resolvedEnd = new Date("2100-01-02T00:00:00Z");
// //         }

// //         const dbQuizObject = {
// //             id: finalQuizId,
// //             title: generatedQuizPayload.title,
// //             questions: generatedQuizPayload.questions,
// //             startTime: resolvedStart,
// //             endTime: resolvedEnd,
// //             published: publish,
// //             publishedAt: publish ? new Date() : null,
// //             course: courseName,
// //             generatedBy: "ai",
// //             source: sourceInfo
// //         };

// //         // UPSERT into database
// //         await collections.quiz().updateOne(
// //             { id: finalQuizId },
// //             { $set: dbQuizObject },
// //             { upsert: true }
// //         );

// //         if (global.addLog) global.addLog(`[Quiz] Saved: "${dbQuizObject.title}" (${publish ? "LIVE" : "DRAFT"})`);

// //         res.status(201).json({
// //             message: publish
// //                 ? `Quiz generated and published! Live for ${durationHours} hour(s).`
// //                 : "Quiz generated and saved as draft. Use Publish to make it live.",
// //             quizId: finalQuizId,
// //             published: publish,
// //             activeUntil: publish ? resolvedEnd : null,
// //             source: sourceInfo,
// //             quizData: dbQuizObject
// //         });

// //     } catch (err) {
// //         console.error("Quiz Gen error:", err);
// //         if (global.addLog) global.addLog(`[AI Error] Quiz Generation failed: ${err.message}`);
// //         res.status(500).json({ 
// //             error: "Failed to generate AI quiz", 
// //             details: err.message,
// //             stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
// //         });
// //     }
// // });

// // module.exports = router;


// const express = require("express");
// const crypto = require("crypto");
// const { z } = require("zod");
// const { collections } = require("../config/db");
// const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
// const { Chroma } = require("@langchain/community/vectorstores/chroma");
// const { HumanMessage, AIMessage } = require("@langchain/core/messages");
// const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
// const multer = require("multer");
// const PDFParser = require("pdf2json");
// const { OPENAI_API_KEY } = require("../config/config");

// const storage = multer.memoryStorage();
// const quizUpload = multer({ storage });

// const router = express.Router();

// // ─────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────

// function extractPdfText(buffer) {
//     return new Promise((resolve, reject) => {
//         const parser = new PDFParser(null, 1);
//         parser.on("pdfParser_dataReady", (data) => {
//             try {
//                 const text = data.Pages
//                     .map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" "))
//                     .join("\n");
//                 resolve(text);
//             } catch (e) { reject(e); }
//         });
//         parser.on("pdfParser_dataError", (err) => reject(new Error(err.parserError || err)));
//         parser.parseBuffer(buffer);
//     });
// }

// function getVectorStore(courseName) {
//     const collectionName = courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
//     return new Chroma(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }), {
//         collectionName,
//         url: "http://127.0.0.1:8000"
//     });
// }

// /**
//  * Splits a long text into overlapping chunks suitable for embedding.
//  * chunkSize    — max characters per chunk
//  * chunkOverlap — characters shared between adjacent chunks (context continuity)
//  */
// function chunkText(text, chunkSize = 1500, chunkOverlap = 200) {
//     const chunks = [];
//     let start = 0;
//     while (start < text.length) {
//         const end = Math.min(start + chunkSize, text.length);
//         chunks.push(text.slice(start, end));
//         if (end === text.length) break;
//         start += chunkSize - chunkOverlap;
//     }
//     return chunks;
// }

// /**
//  * Embeds text chunks and stores them in:
//  *   - ChromaDB  → for fast similarity search
//  *   - MongoDB   → `vectors` collection, for persistence / audit
//  *
//  * MongoDB document shape per chunk:
//  * {
//  *   courseId   : string,    // slugified course name, e.g. "mathematics_101"
//  *   courseName : string,    // original course name
//  *   source     : string,    // filename or "direct-upload"
//  *   chunkIndex : number,    // position within the document
//  *   text       : string,    // raw chunk text
//  *   embedding  : number[],  // OpenAI embedding vector (1536 dims)
//  *   createdAt  : Date
//  * }
//  */
// async function embedAndStore(courseName, text, source = "direct-upload") {
//     const embedder = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
//     const vectorStore = getVectorStore(courseName);

//     const chunks = chunkText(text);
//     if (!chunks.length) return;

//     // Generate all embeddings in one batched call
//     const embeddings = await embedder.embedDocuments(chunks);

//     // 1. Upsert into ChromaDB for similarity search
//     const documents = chunks.map((chunk, i) => ({
//         pageContent: chunk,
//         metadata: { source, chunkIndex: i }
//     }));
//     await vectorStore.addDocuments(documents);

//     // 2. Persist to MongoDB `vectors` collection
//     const courseId = courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
//     const mongoDocs = chunks.map((chunk, i) => ({
//         courseId,
//         courseName,
//         source,
//         chunkIndex: i,
//         text: chunk,
//         embedding: embeddings[i],
//         createdAt: new Date(),
//     }));

//     await collections.vectors().insertMany(mongoDocs);
//     console.log(`[Vectors] Stored ${mongoDocs.length} chunks for "${courseName}" (source: ${source})`);
// }

// // ─────────────────────────────────────────────
// // Debug Routes
// // ─────────────────────────────────────────────

// router.get("/test", (req, res) => res.json({ success: true }));

// router.get("/debug/chroma", async (req, res) => {
//     try {
//         const response = await fetch("http://127.0.0.1:8000/api/v2/heartbeat");
//         const data = await response.json();
//         res.json({ status: "connected", heartbeat: data });
//     } catch (err) {
//         res.status(500).json({ status: "disconnected", error: err.message });
//     }
// });

// router.get("/debug/collection/:course", async (req, res) => {
//     try {
//         const collectionName = req.params.course.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
//         const response = await fetch(`http://127.0.0.1:8000/api/v1/collections/${collectionName}/count`);
//         const data = await response.json();
//         res.json({ collection: collectionName, count: data });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // GET /api/ai/debug/vectors/:course
// // Returns all stored vector metadata for a course (omits the embedding arrays)
// router.get("/debug/vectors/:course", async (req, res) => {
//     try {
//         const courseId = req.params.course.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
//         const docs = await collections.vectors()
//             .find({ courseId }, { projection: { embedding: 0 } })
//             .sort({ createdAt: -1 })
//             .toArray();
//         res.json({ courseId, count: docs.length, chunks: docs });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ─────────────────────────────────────────────
// // Chat Routes
// // ─────────────────────────────────────────────

// // POST /api/ai/chat/:course
// // Body: { question, studentId?, chatId? }
// // Returns: { answer, chatId }
// router.post("/chat/:course", async (req, res) => {
//     try {
//         const { question, studentId = "anonymous", chatId } = req.body || {};
//         const courseName = req.params.course;

//         if (!question) return res.status(400).json({ error: "question required" });
//         if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

//         const currentChatId = chatId || crypto.randomUUID();

//         // 1. Fetch chat history from MongoDB
//         const chatDoc = await collections.chats().findOne({ chatId: currentChatId });
//         const messagesHistory = chatDoc?.messages?.map(msg =>
//             msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
//         ) || [];

//         // 2. Fetch relevant context from ChromaDB
//         const vectorStore = getVectorStore(courseName);
//         const docs = await vectorStore.similaritySearch(question, 4);
//         const contextStr = docs.map(d => d.pageContent).join("\n\n");

//         // 3. Build prompt with chat history
//         const prompt = ChatPromptTemplate.fromMessages([
//             ["system", `You are a helpful AI tutor for the course '{course}'.
// Answer the student's question based strictly on the provided context below.
// If the context is insufficient, tell them to consult the instructor.

// Context: {context}`],
//             new MessagesPlaceholder("history"),
//             ["human", "{question}"]
//         ]);

//         const llm = new ChatOpenAI({
//             openAIApiKey: OPENAI_API_KEY,
//             modelName: "gpt-3.5-turbo",
//             temperature: 0.3
//         });

//         // 4. Generate answer
//         const chain = prompt.pipe(llm);
//         const response = await chain.invoke({
//             course: courseName,
//             context: contextStr,
//             history: messagesHistory,
//             question
//         });

//         const answer = response.content;

//         // 5. Persist messages to MongoDB
//         await collections.chats().updateOne(
//             { chatId: currentChatId },
//             {
//                 $set: { studentId, courseName, updatedAt: new Date() },
//                 $setOnInsert: { createdAt: new Date() },
//                 $push: {
//                     messages: {
//                         $each: [
//                             { role: "user", content: question, timestamp: new Date() },
//                             { role: "ai", content: answer, timestamp: new Date() }
//                         ]
//                     }
//                 }
//             },
//             { upsert: true }
//         );

//         res.json({ answer, chatId: currentChatId });
//     } catch (err) {
//         console.error("Chat error:", err);
//         res.status(500).json({ error: "Failed to generate AI response" });
//     }
// });

// // GET /api/ai/chats/:studentId/:course
// // Returns list of chat sessions (with first message preview) for a student in a course
// router.get("/chats/:studentId/:course", async (req, res) => {
//     try {
//         const { studentId, course } = req.params;
//         const chats = await collections.chats()
//             .find({ studentId, courseName: course })
//             .sort({ updatedAt: -1 })
//             .project({ chatId: 1, updatedAt: 1, messages: { $slice: 1 } })
//             .toArray();
//         res.json(chats);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // GET /api/ai/chat/:chatId
// // Returns full chat history for a single session
// router.get("/chat/:chatId", async (req, res) => {
//     try {
//         const chat = await collections.chats().findOne({ chatId: req.params.chatId });
//         if (!chat) return res.status(404).json({ error: "Chat not found" });
//         res.json(chat);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// // ─────────────────────────────────────────────
// // PDF Upload & Embedding Route
// // ─────────────────────────────────────────────

// // POST /api/ai/upload/:course
// // Embeds a PDF into ChromaDB AND stores chunks in MongoDB `vectors` collection.
// // Body: multipart/form-data, field name "pdf"
// router.post("/upload/:course", quizUpload.single("pdf"), async (req, res) => {
//     try {
//         const courseName = req.params.course;

//         if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });
//         if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

//         const text = await extractPdfText(req.file.buffer);
//         if (!text.trim()) return res.status(400).json({ error: "Could not extract text from PDF" });

//         await embedAndStore(courseName, text, req.file.originalname);

//         res.json({
//             message: "PDF embedded and stored successfully",
//             source: req.file.originalname
//         });
//     } catch (err) {
//         console.error("Upload error:", err);
//         res.status(500).json({ error: "Failed to process PDF", details: err.message });
//     }
// });

// // ─────────────────────────────────────────────
// // AI Quiz Generation Route
// // Returns quiz JSON only — no DB writes
// // ─────────────────────────────────────────────

// // Schema matches quiz.js exactly:
// // { id, title, questions: [{ question, options[4], answer }], startTime, endTime }
// const quizSchema = z.object({
//     title: z.string().describe("A clear, descriptive title for the quiz"),
//     questions: z.array(z.object({
//         question: z.string().describe("The quiz question text"),
//         options: z.array(z.string()).length(4).describe("Exactly four multiple choice options"),
//         answer: z.string().describe("Must be the exact string of the correct option from the options array")
//     }))
// });

// // POST /api/ai/generate-quiz/:course
// // Body (multipart/form-data): { numQuestions?, difficulty?, startTime?, endTime? }
// // File: pdf (optional, field name: "pdf")
// //
// // Returns:
// // { id, title, questions: [{ question, options: [x4], answer }], startTime, endTime }
// router.post("/generate-quiz/:course", quizUpload.single("pdf"), async (req, res) => {
//     try {
//         const courseName = req.params.course;
//         const {
//             numQuestions = 5,
//             difficulty = "medium",
//             startTime,
//             endTime,
//         } = req.body || {};

//         if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

//         // ── 1. Get context ────────────────────────────────────────────
//         let contextStr = "";

//         if (req.file) {
//             // Extract text for immediate use as context
//             const text = await extractPdfText(req.file.buffer);
//             contextStr = text;

//             // Background: also embed and persist for future chat/quiz use
//             embedAndStore(courseName, text, req.file.originalname).catch(err =>
//                 console.error("[Quiz Gen] Background embed failed:", err.message)
//             );
//         } else {
//             // Fall back to existing ChromaDB embeddings
//             const vectorStore = getVectorStore(courseName);
//             const docs = await vectorStore.similaritySearch(
//                 "key topics summary overview concepts definitions", 6
//             );

//             if (!docs.length) {
//                 return res.status(400).json({
//                     error: "No course materials found. Upload a PDF or attach one directly."
//                 });
//             }

//             contextStr = docs.map(d => d.pageContent).join("\n\n");
//         }

//         // ── 2. Generate structured quiz via LLM ───────────────────────
//         const llm = new ChatOpenAI({
//             openAIApiKey: OPENAI_API_KEY,
//             modelName: "gpt-4o-mini",
//             temperature: 0.5
//         });
//         const structuredLlm = llm.withStructuredOutput(quizSchema);

//         const promptTemplate = ChatPromptTemplate.fromTemplate(`
// You are an expert curriculum designer. Generate a multiple-choice quiz based ONLY on the provided context.

// Course: {course}
// Number of questions: {numQuestions}
// Difficulty: {difficulty}

// IMPORTANT:
// - Each question must have exactly 4 options.
// - The "answer" field must be the EXACT string of the correct option (copy-paste from options array).
// - Base every question strictly on the context below.

// Context:
// {context}
//         `);

//         const formattedPrompt = await promptTemplate.format({
//             course: courseName,
//             numQuestions,
//             difficulty,
//             context: contextStr
//         });

//         const generated = await structuredLlm.invoke(formattedPrompt);

//         // ── 3. Build quiz object matching quiz.js schema ──────────────
//         const quizId = generated.title
//             .toLowerCase()
//             .replace(/[^a-z0-9]+/g, "-")
//             .replace(/^-|-$/g, "");

//         const resolvedStart = startTime ? new Date(startTime) : new Date();
//         const resolvedEnd = endTime ? new Date(endTime) : new Date(Date.now() + 24 * 60 * 60 * 1000);

//         if (isNaN(resolvedStart) || isNaN(resolvedEnd)) {
//             return res.status(400).json({ error: "Invalid startTime or endTime" });
//         }

//         const quiz = {
//             id: quizId,
//             title: generated.title,
//             questions: generated.questions,  // [{ question, options[4], answer }]
//             startTime: resolvedStart,
//             endTime: resolvedEnd,
//         };

//         // ── 4. Return JSON only — caller decides whether to save ──────
//         return res.status(200).json(quiz);

//     } catch (err) {
//         console.error("Quiz Gen error:", err);
//         res.status(500).json({
//             error: "Failed to generate AI quiz",
//             details: err.message
//         });
//     }
// });

// module.exports = router;

/**
 * routes/ai.js  —  NO ChromaDB dependency
 * Vector search is done via cosine-similarity over MongoDB `vectors` collection.
 * Requires: OPENAI_API_KEY in config, MongoDB `vectors` + `chats` collections.
 */

const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const PDFParser = require("pdf2json");

const { collections } = require("../config/db");
const { OPENAI_API_KEY } = require("../config/config");

// LangChain
const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Extract plain text from a PDF buffer via pdf2json */
// function extractPdfText(buffer) {
//     return new Promise((resolve, reject) => {
//         const parser = new PDFParser(null, 1);
//         parser.on("pdfParser_dataReady", (data) => {
//             try {
//                 const text = data.Pages
//                     .map(p => p.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" "))
//                     .join("\n");
//                 resolve(text);
//             } catch (e) { reject(e); }
//         });
//         parser.on("pdfParser_dataError", err =>
//             reject(new Error(err.parserError || String(err)))
//         );
//         parser.parseBuffer(buffer);
//     });
// }
const pdfParse = require("pdf-parse");

// Replace your extractPdfText function with this:
async function extractPdfText(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
}

/** Split text into overlapping chunks */
function chunkText(text, chunkSize = 1500, overlap = 200) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        if (end === text.length) break;
        start += chunkSize - overlap;
    }
    return chunks;
}

/** Cosine similarity between two equal-length vectors */
function cosineSim(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (!normA || !normB) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Embed text chunks → store in MongoDB `vectors` collection.
 * Each doc: { courseId, courseName, source, chunkIndex, text, embedding, createdAt }
 */
async function embedAndStore(courseName, text, source = "direct-upload") {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");

    const embedder = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
    const chunks = chunkText(text);
    if (!chunks.length) return 0;

    const embeddings = await embedder.embedDocuments(chunks);
    const courseId = courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

    const docs = chunks.map((chunk, i) => ({
        courseId,
        courseName,
        source,
        chunkIndex: i,
        text: chunk,
        embedding: embeddings[i],
        createdAt: new Date(),
    }));

    await collections.vectors().insertMany(docs);
    console.log(`[Vectors] Stored ${docs.length} chunks for "${courseName}" (${source})`);
    return docs.length;
}

/**
 * Find the k most similar chunks in MongoDB for a given query.
 * Loads all embeddings for the course into memory, ranks by cosine similarity.
 */
async function similaritySearch(courseName, query, k = 4) {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY missing");

    const embedder = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });
    const [qEmbedding] = await embedder.embedDocuments([query]);

    const courseId = courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const docs = await collections.vectors()
        .find({ courseId })
        .toArray();

    if (!docs.length) return [];

    const ranked = docs
        .map(doc => ({ text: doc.text, score: cosineSim(qEmbedding, doc.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);

    return ranked;
}

// ─────────────────────────────────────────────────────────────────────────────
// Routes — Debug
// ─────────────────────────────────────────────────────────────────────────────

router.get("/test", (_req, res) => res.json({ success: true }));

// GET /api/ai/debug/vectors/:course  — list stored chunks (no embeddings)
router.get("/debug/vectors/:course", async (req, res) => {
    try {
        const courseId = req.params.course.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        const docs = await collections.vectors()
            .find({ courseId }, { projection: { embedding: 0 } })
            .sort({ createdAt: -1 })
            .toArray();
        res.json({ courseId, count: docs.length, chunks: docs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes — PDF Upload & Embed
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/upload/:course
// multipart/form-data, field "pdf"
router.post("/upload/:course", upload.single("pdf"), async (req, res) => {
    try {
        const courseName = req.params.course;
        if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });
        if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

        const text = await extractPdfText(req.file.buffer);
        if (!text.trim()) return res.status(400).json({ error: "Could not extract text from PDF" });

        const count = await embedAndStore(courseName, text, req.file.originalname);

        res.json({
            message: "PDF embedded successfully",
            source: req.file.originalname,
            chunks: count,
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Failed to process PDF", details: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes — Chat
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/chat/:course
// Body JSON: { question, studentId?, chatId? }
router.post("/chat/:course", async (req, res) => {
    try {
        const { question, studentId = "anonymous", chatId } = req.body || {};
        const courseName = req.params.course;

        if (!question) return res.status(400).json({ error: "question required" });
        if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

        const currentChatId = chatId || crypto.randomUUID();

        // 1. Fetch chat history
        const chatDoc = await collections.chats().findOne({ chatId: currentChatId });
        const messagesHistory = (chatDoc?.messages || []).map(m =>
            m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
        );

        // 2. Similarity search in MongoDB
        const hits = await similaritySearch(courseName, question, 4);
        const contextStr = hits.map(h => h.text).join("\n\n") || "No course material available yet.";

        // 3. Build prompt
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are a helpful AI tutor for the course "{course}".
Answer the student's question using ONLY the context below.
If the context is insufficient, say so and suggest consulting the instructor.

Context:
{context}`],
            new MessagesPlaceholder("history"),
            ["human", "{question}"],
        ]);

        const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, modelName: "gpt-3.5-turbo", temperature: 0.3 });
        const chain = prompt.pipe(llm);

        const aiResponse = await chain.invoke({
            course: courseName,
            context: contextStr,
            history: messagesHistory,
            question,
        });

        const answer = aiResponse.content;

        // 4. Persist to MongoDB
        await collections.chats().updateOne(
            { chatId: currentChatId },
            {
                $set: { studentId, courseName, updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() },
                $push: {
                    messages: {
                        $each: [
                            { role: "user", content: question, timestamp: new Date() },
                            { role: "ai", content: answer, timestamp: new Date() },
                        ],
                    },
                },
            },
            { upsert: true }
        );

        res.json({ answer, chatId: currentChatId });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Failed to generate AI response", details: err.message });
    }
});

// GET /api/ai/chats/:studentId/:course  — list sessions (with first message preview)
router.get("/chats/:studentId/:course", async (req, res) => {
    try {
        const { studentId, course } = req.params;
        const chats = await collections.chats()
            .find({ studentId, courseName: course })
            .sort({ updatedAt: -1 })
            .project({ chatId: 1, updatedAt: 1, messages: { $slice: 1 } })
            .toArray();
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/ai/chat/:chatId  — full history for one session
router.get("/chat/:chatId", async (req, res) => {
    try {
        const chat = await collections.chats().findOne({ chatId: req.params.chatId });
        if (!chat) return res.status(404).json({ error: "Chat not found" });
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes — AI Quiz Generation
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/generate-quiz/:course
// multipart/form-data: { numQuestions?, difficulty?, startTime?, endTime?, pdf? }
router.post("/generate-quiz/:course", upload.single("pdf"), async (req, res) => {
    try {
        const courseName = req.params.course;
        const { numQuestions = 5, difficulty = "medium", startTime, endTime } = req.body || {};

        if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

        // 1. Get context
        let contextStr = "";

        if (req.file) {
            contextStr = await extractPdfText(req.file.buffer);
            // Background embed
            embedAndStore(courseName, contextStr, req.file.originalname)
                .catch(e => console.error("[Quiz Gen] embed failed:", e.message));
        } else {
            const hits = await similaritySearch(
                courseName,
                "key topics summary overview concepts definitions",
                6
            );
            if (!hits.length) {
                return res.status(400).json({
                    error: "No course materials found. Upload a PDF first.",
                });
            }
            contextStr = hits.map(h => h.text).join("\n\n");
        }

        // 2. Generate quiz via structured LLM output
        const llm = new ChatOpenAI({
            openAIApiKey: OPENAI_API_KEY,
            modelName: "gpt-4o-mini",
            temperature: 0.5,
        });

        const promptText = `You are an expert curriculum designer.
Generate a multiple-choice quiz based ONLY on the provided context.

Course: ${courseName}
Number of questions: ${numQuestions}
Difficulty: ${difficulty}

Rules:
- Each question must have exactly 4 options.
- The "answer" field must be the EXACT text of the correct option.
- Base every question strictly on the context below.
- Respond ONLY with valid JSON. No markdown, no extra text.

JSON format:
{
  "title": "Quiz title",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}

Context:
${contextStr}`;

        const response = await llm.invoke(promptText);
        let generated;
        try {
            const raw = response.content.replace(/```json|```/g, "").trim();
            generated = JSON.parse(raw);
        } catch {
            return res.status(500).json({ error: "LLM returned invalid JSON for quiz" });
        }

        const quizId = (generated.title || "quiz")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const resolvedStart = startTime ? new Date(startTime) : new Date();
        const resolvedEnd = endTime ? new Date(endTime) : new Date(Date.now() + 86400000);

        if (isNaN(resolvedStart) || isNaN(resolvedEnd))
            return res.status(400).json({ error: "Invalid startTime or endTime" });

        return res.json({
            id: quizId,
            title: generated.title,
            questions: generated.questions,
            startTime: resolvedStart,
            endTime: resolvedEnd,
        });
    } catch (err) {
        console.error("Quiz Gen error:", err);
        res.status(500).json({ error: "Failed to generate quiz", details: err.message });
    }
});

module.exports = router;