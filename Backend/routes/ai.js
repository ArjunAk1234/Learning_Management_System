const express = require("express");
const crypto = require("crypto");
const { z } = require("zod");
const { collections } = require("../config/db");
const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf2json");

// Extracts plain text from a PDF Buffer using pdf2json
function extractPdfText(buffer) {
    return new Promise((resolve, reject) => {
        const parser = new PDFParser(null, 1);
        parser.on("pdfParser_dataReady", (data) => {
            try {
                const text = data.Pages
                    .map(page => page.Texts.map(t => {
                        try { return decodeURIComponent(t.R[0].T); } 
                        catch (err) { return unescape(t.R[0].T); }
                    }).join(" "))
                    .join("\n");
                resolve(text);
            } catch (e) { reject(e); }
        });
        parser.on("pdfParser_dataError", (err) => reject(new Error(err.parserError || err)));
        parser.parseBuffer(buffer);
    });
}
const multer = require("multer");
const { processAndEmbedPdf } = require("../utils/aiHelper");
const { OPENAI_API_KEY, UPLOAD_DIR } = require("../config/config");

const storage = multer.memoryStorage();
const quizUpload = multer({ storage });

const router = express.Router();

router.get("/test", (req, res) => res.json({ success: true }));

router.get("/debug/chroma", async (req, res) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/v2/heartbeat");
        const data = await response.json();
        res.json({ status: "connected", heartbeat: data });
    } catch (err) {
        res.status(500).json({ status: "disconnected", error: err.message });
    }
});

router.get("/debug/collection/:course", async (req, res) => {
    try {
        const collectionName = req.params.course.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        const response = await fetch(`http://127.0.0.1:8000/api/v1/collections/${collectionName}/count`);
        const data = await response.json();
        res.json({ collection: collectionName, count: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

function getVectorStore(courseName) {
    const collectionName = courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    return new Chroma(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }), {
        collectionName,
        url: "http://127.0.0.1:8000"
    });
}

// ─────────────────────────────────────────────
// Persistent Chat Route
// ─────────────────────────────────────────────
router.post("/chat/:course", async (req, res) => {
    try {
        const { question, studentId = "anonymous", chatId } = req.body || {};
        const courseName = req.params.course;

        if (!question) return res.status(400).json({ error: "question required" });
        if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

        // Generate or reuse chatId
        const currentChatId = chatId || crypto.randomUUID();

        // 1. Fetch chat history from MongoDB
        const chatDoc = await collections.chats().findOne({ chatId: currentChatId });
        let messagesHistory = [];
        if (chatDoc && chatDoc.messages) {
            messagesHistory = chatDoc.messages.map(msg =>
                msg.role === "user" ? new HumanMessage(msg.content) : new AIMessage(msg.content)
            );
        }

        // 2. Fetch context from DB
        const vectorStore = getVectorStore(courseName);
        const docs = await vectorStore.similaritySearch(question, 4);
        const contextStr = docs.map(d => d.pageContent).join("\n\n");

        // 3. Build the prompt with memory
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are a helpful AI tutor for the course '{course}'. 
            Answer the student's question based strictly on the provided context below.
            If the context is insufficient, tell them to consult the instructor.
            
            Context: {context}`],
            new MessagesPlaceholder("history"),
            ["human", "{question}"]
        ]);

        const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, modelName: "gpt-3.5-turbo", temperature: 0.3 });

        // 4. Generate answer
        const chain = prompt.pipe(llm);
        const response = await chain.invoke({
            course: courseName,
            context: contextStr,
            history: messagesHistory,
            question: question
        });

        const answer = response.content;

        // 5. Save back to MongoDB
        const newMessages = [
            { role: "user", content: question, timestamp: new Date() },
            { role: "ai", content: answer, timestamp: new Date() }
        ];

        await collections.chats().updateOne(
            { chatId: currentChatId },
            {
                $set: { studentId, courseName, updatedAt: new Date() },
                $setOnInsert: { createdAt: new Date() },
                $push: { messages: { $each: newMessages } }
            },
            { upsert: true }
        );

        res.json({ answer, chatId: currentChatId });
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
});

// GET /api/ai/chats/:studentId/:course
router.get("/chats/:studentId/:course", async (req, res) => {
    try {
        const { studentId, course } = req.params;
        const chats = await collections.chats().find({ studentId, courseName: course })
            .sort({ updatedAt: -1 })
            .project({ chatId: 1, updatedAt: 1, "messages": { $slice: 1 } }) // only get first message for preview
            .toArray();
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /api/ai/chat/:chatId
router.get("/chat/:chatId", async (req, res) => {
    try {
        const chat = await collections.chats().findOne({ chatId: req.params.chatId });
        if (!chat) return res.status(404).json({ error: "Chat not found" });
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ─────────────────────────────────────────────
// AI Quiz Generation Route
// ─────────────────────────────────────────────

const quizSchema = z.object({
    title: z.string().describe("A catchy title for the quiz"),
    questions: z.array(z.object({
        question: z.string().describe("The quiz question text"),
        options: z.array(z.string()).length(4).describe("Four multiple choice options including the correct one"),
        answer: z.string().describe("The exact string match of the correct option")
    }))
});

router.post("/generate-quiz/:course", quizUpload.single("pdf"), async (req, res) => {
    try {
        const courseName = req.params.course;
        const {
            numQuestions = 5,
            difficulty = "medium",
            startTime,
            endTime,
            quizId,
            publish = false,       // NEW: if true, immediately make quiz live for students
            durationHours = 24     // NEW: how long the quiz stays active when published
        } = req.body || {};

        if (!OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEY missing" });

        let contextStr = "";
        let sourceInfo = "Vector DB (Chroma)";

        // 🟢 Case A: User uploaded a file specifically for this quiz
        if (req.file) {
            if (global.addLog) global.addLog(`[Quiz Gen] Direct File detected. Extracting text for instant use...`);
            sourceInfo = `Direct Upload: ${req.file.originalname}`;
            const pdfData = await extractPdfText(req.file.buffer);
            contextStr = pdfData;

            // Simultaneously save and embed for the future
            try {
                const dir = path.join(UPLOAD_DIR, "resources", courseName);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                const fileName = Date.now() + "_" + req.file.originalname;
                const fullPath = path.join(dir, fileName);
                fs.writeFileSync(fullPath, req.file.buffer);

                await collections.courses().updateOne(
                    { name: courseName },
                    { $push: { resources: fileName } }
                );
                // Background embedding
                processAndEmbedPdf(courseName, fullPath);
            } catch (saveErr) {
                console.error("Failed to save direct quiz file:", saveErr);
            }
        } 
        // 🔵 Case B: Fallback to existing ChromaDB memory
        else {
            const vectorStore = getVectorStore(courseName);
            const docs = await vectorStore.similaritySearch("key topics summary overview concepts definitions", 6);
            contextStr = docs.map(d => d.pageContent).join("\n\n");
            
            if (!docs.length) {
                return res.status(400).json({ 
                    error: "No course materials found. Please upload a PDF in the 'Upload' section or attach a PDF directly here." 
                });
            }
        }

        // 2. Generate structured quiz
        const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, modelName: "gpt-4o-mini", temperature: 0.5 });
        const structuredLlm = llm.withStructuredOutput(quizSchema);

        const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are an expert curriculum designer. Generate a multiple-choice quiz based ONLY on the provided course context.
Course Name: {course}
Number of Questions: {numQuestions}
Difficulty Level: {difficulty}

Context: {context}

Ensure there are exactly 4 options per question, and the 'answer' field perfectly matches one of the options.
        `);

        const formattedPrompt = await promptTemplate.format({
            course: courseName,
            numQuestions,
            difficulty,
            context: contextStr
        });

        console.log(`[AI] Generating ${difficulty} quiz with ${numQuestions} questions for ${courseName}...`);

        const generatedQuizPayload = await structuredLlm.invoke(formattedPrompt);

        // 3. Build the quiz object — apply publish logic here, right after LLM returns schema
        const finalQuizId = quizId || generatedQuizPayload.title.replace(/\s+/g, '-').toLowerCase();

        // Resolve timing: if publish=true, go live NOW; otherwise, save as draft (far future start)
        let resolvedStart, resolvedEnd;
        if (publish) {
            resolvedStart = new Date();
            resolvedEnd = new Date(Date.now() + Number(durationHours) * 60 * 60 * 1000);
            if (global.addLog) global.addLog(`[Quiz] Publishing "${generatedQuizPayload.title}" immediately for ${durationHours}h`);
        } else if (startTime && endTime) {
            resolvedStart = new Date(startTime);
            resolvedEnd = new Date(endTime);
        } else {
            // Draft: start time is 100 years in future so it won't appear as active
            resolvedStart = new Date("2100-01-01T00:00:00Z");
            resolvedEnd = new Date("2100-01-02T00:00:00Z");
        }

        const dbQuizObject = {
            id: finalQuizId,
            title: generatedQuizPayload.title,
            questions: generatedQuizPayload.questions,
            startTime: resolvedStart,
            endTime: resolvedEnd,
            published: publish,
            publishedAt: publish ? new Date() : null,
            course: courseName,
            generatedBy: "ai",
            source: sourceInfo
        };

        // UPSERT into database
        await collections.quiz().updateOne(
            { id: finalQuizId },
            { $set: dbQuizObject },
            { upsert: true }
        );

        if (global.addLog) global.addLog(`[Quiz] Saved: "${dbQuizObject.title}" (${publish ? "LIVE" : "DRAFT"})`);

        res.status(201).json({
            message: publish
                ? `Quiz generated and published! Live for ${durationHours} hour(s).`
                : "Quiz generated and saved as draft. Use Publish to make it live.",
            quizId: finalQuizId,
            published: publish,
            activeUntil: publish ? resolvedEnd : null,
            source: sourceInfo,
            quizData: dbQuizObject
        });

    } catch (err) {
        console.error("Quiz Gen error:", err);
        if (global.addLog) global.addLog(`[AI Error] Quiz Generation failed: ${err.message}`);
        res.status(500).json({ 
            error: "Failed to generate AI quiz", 
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

module.exports = router;
