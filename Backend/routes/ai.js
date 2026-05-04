

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