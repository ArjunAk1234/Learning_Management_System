const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf2json");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { OPENAI_API_KEY } = require("../config/config");

// This function takes a saved PDF file, extracts the text, 
// breaks it into smaller chunks, and saves it into ChromaDB.
async function processAndEmbedPdf(courseName, pdfFilePath) {
    try {
        if (!OPENAI_API_KEY) {
            console.warn("⚠️ OPENAI_API_KEY is not set. Skipping AI embedding for this PDF.");
            return false;
        }

        if (global.addLog) global.addLog(`[AI] Starting PDF processing for course: ${courseName}`);
        
        // 1. Read PDF file
        const dataBuffer = fs.readFileSync(pdfFilePath);
        const rawText = await new Promise((resolve, reject) => {
            const parser = new PDFParser(null, 1);
            parser.on("pdfParser_dataReady", (data) => {
                const text = data.Pages
                    .map(page => page.Texts.map(t => decodeURIComponent(t.R[0].T)).join(" "))
                    .join("\n");
                resolve(text);
            });
            parser.on("pdfParser_dataError", (err) => reject(new Error(err.parserError || err)));
            parser.parseBuffer(dataBuffer);
        });

        if (!rawText || rawText.trim().length === 0) {
            console.error("[AI] No extractable text found in this PDF.");
            return false;
        }

        // 2. Chunk the text
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        
        const docs = await textSplitter.createDocuments(
            [rawText], 
            [{ source: pdfFilePath, course: courseName }]
        );

        if (global.addLog) global.addLog(`[AI] Fragmented PDF into ${docs.length} smaller documents.`);

        // 3. Generate Embeddings and push to ChromaDB
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: OPENAI_API_KEY,
            modelName: "text-embedding-3-small"
        });

        // Store into ChromaDB specific to this course
        await Chroma.fromDocuments(docs, embeddings, {
            collectionName: courseName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase(),
            url: "http://127.0.0.1:8000" 
        });

        if (global.addLog) global.addLog(`[AI] ✅ Successfully embedded ${docs.length} chunks into ChromaDB for ${courseName}.`);
        return true;

    } catch (error) {
        const errMsg = `[AI Error] Failed to process and embed PDF: ${error.message}`;
        console.error(errMsg);
        if (global.addLog) global.addLog(errMsg);
        return false;
    }
}

module.exports = {
    processAndEmbedPdf
};
