import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import OpenAI from "openai";
import multer from "multer";
import { uploadDocument, queryRAG, clearDocuments } from "./rag.js";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

const app = express();

// Security Middleware

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", //server hanya bisa diakses oleh spesifik domain atau url
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 menit window
  max: 100, // maksimal 100 request per IP adress
  message: "Too many requests from this IP, please try again after some time",
});

app.use(limiter);

app.use(express.json({ limit: "10mb" }));

const API_KEY = process.env.NEBIUS_API_KEY;

const client = new OpenAI({
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
  apiKey: API_KEY,
});

// buat end point
app.post("/api/explain-research", async (request, response) => {
  // tombol explain research, ngirim data (post) ke server side dari client side
  // "async () => {} "" ==> callback function, bakal otomatis dieksekusi abis pencet tombol explain research

  try {
    const { research, language } = request.body;

    if (!research) {
      return response.status(400).json({ error: "research is required" });
    }
    const messages = [
      {
        role: "user",
        content: `Please explain this research in simple terms:\n${research}`,
      },
    ];

    const AI_response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct", // otak ai
      messages,
      temperature: 0.3, // seberapa creative dan deterministic, makin besar temperature makin creative, makin kecil makin deterministic,
      // contoh kalo temperature 0.3, mungkin akan ada 30% kesalahan, tapi akan lebih creative
      // kalo temperature : 0, jawaban bakal sama kalo inputnya sama
      max_tokens: 400, // maksimal panjang jawaban dari ai
    });

    const explanation = AI_response?.choices[0]?.message?.content;
    if (!explanation) {
      return response.status(500).json({ error: "Failed to explain research" });
    }
    response.json({ explanation, language: language || "unknown" });
  } catch (err) {
    console.error("research Explain API Error:", err);
    response.status(500).json({ error: "Server error", details: err.message });
  }
});

/* const checkNebiusConnection = async () => {
  try {
    console.log("Checking Nebius API connection...");
    const models = await client.models.list();
    console.log("Connection successful! Available models:");
    models.data.forEach((m) => console.log(`- ${m.id}`));
  } catch (error) {
    console.error("Error connecting to Nebius API:", error.message);
  }
};

checkNebiusConnection();
 */

// ============ RAG Endpoints ============

// Upload PDF and process for RAG
app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    console.log(`Processing PDF: ${req.file.originalname}`);
    const result = await uploadDocument(req.file.buffer, req.file.originalname);

    res.json({
      success: true,
      message: `PDF processed successfully`,
      filename: result.filename,
      chunks: result.chunks_count,
    });
  } catch (err) {
    console.error("PDF Upload Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process PDF", details: err.message });
  }
});

// Query RAG with similarity search
app.post("/api/query-rag", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    console.log(`RAG Query: ${query.substring(0, 50)}...`);
    const result = await queryRAG(query);

    res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (err) {
    console.error("RAG Query Error:", err);
    res
      .status(500)
      .json({ error: "Failed to query documents", details: err.message });
  }
});

// Clear all documents (for testing)
app.delete("/api/documents", async (req, res) => {
  try {
    await clearDocuments();
    res.json({ success: true, message: "All documents cleared" });
  } catch (err) {
    console.error("Clear Documents Error:", err);
    res
      .status(500)
      .json({ error: "Failed to clear documents", details: err.message });
  }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
