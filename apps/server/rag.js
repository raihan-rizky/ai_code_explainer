import { createClient } from "@supabase/supabase-js";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import { pipeline } from "@xenova/transformers";

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize Nebius OpenAI-compatible client for embeddings and LLM
const nebius = new OpenAI({
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

/**
 * SQL to create the documents table in Supabase:
 *
 * CREATE EXTENSION IF NOT EXISTS vector;
 *
 * CREATE TABLE documents (
 *   id BIGSERIAL PRIMARY KEY,
 *   content TEXT NOT NULL,
 *   embedding VECTOR(384),
 *   metadata JSONB DEFAULT '{}'::jsonb,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
 *
 * CREATE OR REPLACE FUNCTION match_documents(
 *   query_embedding VECTOR(384),
 *   match_count INT DEFAULT 5,
 *   filter JSONB DEFAULT '{}'::jsonb
 * ) RETURNS TABLE (
 *   id BIGINT,
 *   content TEXT,
 *   metadata JSONB,
 *   similarity FLOAT
 * ) LANGUAGE plpgsql AS $$
 * BEGIN
 *   RETURN QUERY
 *   SELECT
 *     d.id,
 *     d.content,
 *     d.metadata,
 *     1 - (d.embedding <=> query_embedding) AS similarity
 *   FROM documents d
 *   WHERE d.metadata @> filter
 *   ORDER BY d.embedding <=> query_embedding
 *   LIMIT match_count;
 * END;
 * $$;
 */

/**
 * Generate embeddings using Supabase/gte-small model (384 dimensions)
 */
async function getEmbedding(text) {
  console.log("[EMBEDDING] Generating embedding for text chunk...");
  const generateEmbedding = await pipeline(
    "feature-extraction",
    "Supabase/gte-small"
  );
  const output = await generateEmbedding(text, {
    pooling: "mean",
    normalize: true,
  });
  const embedding = Array.from(output.data);
  console.log(
    `[EMBEDDING] ✓ Embedding generated (${embedding.length} dimensions)`
  );
  return embedding;
}

/**
 * Parse PDF buffer and extract text
 */
export async function parsePDF(buffer) {
  console.log("[PARSING] Starting PDF parsing...");
  const uint8Array = new Uint8Array(buffer);
  const parser = await new PDFParse(uint8Array);
  const data = await parser.getText();
  console.log("[PARSING] ✓ PDF parsed successfully");
  console.log(
    `[PARSING] Extracted text length: ${data.text.length} characters`
  );
  return data.text;
}

/**
 * Split text into chunks for embedding
 */
export async function splitText(text) {
  console.log("[SPLITTING] Splitting text into chunks...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitText(text);
  console.log(`[SPLITTING] ✓ Text split into ${chunks.length} chunks`);
  return chunks;
}

/**
 * Upload document chunks to Supabase with embeddings
 */
export async function uploadDocument(pdfBuffer, filename) {
  console.log("\n========================================");
  console.log("[UPLOAD] Starting document upload...");
  console.log(`[UPLOAD] Filename: ${filename}`);
  console.log("========================================\n");

  // Parse PDF
  const text = await parsePDF(pdfBuffer);

  // Split into chunks
  const chunks = await splitText(text);

  // Generate embeddings and store in Supabase
  console.log("\n[EMBEDDING] Starting embedding generation for all chunks...");
  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`[EMBEDDING] Processing chunk ${i + 1}/${chunks.length}...`);
    const embedding = await getEmbedding(chunk);

    documents.push({
      content: chunk,
      embedding: embedding,
      metadata: {
        filename: filename,
        chunk_index: i,
        total_chunks: chunks.length,
      },
    });
  }
  console.log("[EMBEDDING] ✓ All embeddings generated\n");

  // Insert into Supabase
  console.log("[DATABASE] Inserting documents into Supabase...");
  const { data, error } = await supabase
    .from("documents")
    .insert(documents)
    .select("id");

  if (error) {
    console.error("[DATABASE] ✗ Failed to upload documents:", error.message);
    throw new Error(`Failed to upload documents: ${error.message}`);
  }

  console.log(`[DATABASE] ✓ Successfully inserted ${data.length} embeddings`);
  console.log("\n========================================");
  console.log("[UPLOAD] ✓ Document upload complete!");
  console.log("========================================\n");

  return {
    success: true,
    filename: filename,
    chunks_count: chunks.length,
    document_ids: data.map((d) => d.id),
  };
}

/**
 * Query documents using similarity search and generate response
 */
export async function queryRAG(queryText, topK = 5) {
  console.log("\n========================================");
  console.log("[QUERY] Starting RAG query...");
  console.log(`[QUERY] Question: ${queryText}`);
  console.log("========================================\n");

  // Get query embedding
  console.log("[QUERY] Generating query embedding...");
  const queryEmbedding = await getEmbedding(queryText);
  console.log("[QUERY] ✓ Query embedding generated\n");

  // Search for similar documents using Supabase RPC
  console.log("[SEARCH] Performing similarity search...");
  const { data: documents, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: topK,
  });

  if (error) {
    console.error("[SEARCH] ✗ Similarity search failed:", error.message);
    throw new Error(`Similarity search failed: ${error.message}`);
  }

  if (!documents || documents.length === 0) {
    console.log("[SEARCH] No relevant documents found");
    return {
      answer: "No relevant documents found. Please upload a PDF first.",
      sources: [],
    };
  }

  console.log(`[SEARCH] ✓ Found ${documents.length} relevant documents`);
  documents.forEach((doc, i) => {
    console.log(
      `  - Source ${i + 1}: similarity ${(doc.similarity * 100).toFixed(1)}%`
    );
  });

  // Build context from retrieved documents
  const context = documents
    .map((doc, i) => `[Source ${i + 1}]: ${doc.content}`)
    .join("\n\n");

  // Generate response using Nebius LLM
  console.log("\n[LLM] Generating response with Llama...");
  const response = await nebius.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that answers questions based on the provided context. 
Use the context to answer the user's question accurately. 
If the answer is not in the context, say so.
Always cite your sources by mentioning [Source X] when referencing information.`,
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${queryText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 800,
  });

  const answer = response?.choices[0]?.message?.content;
  console.log("[LLM] ✓ Response generated");
  console.log("\n========================================");
  console.log("[QUERY] ✓ RAG query complete!");
  console.log("========================================\n");

  return {
    answer: answer || "Failed to generate response",
    sources: documents.map((doc) => ({
      content: doc.content.substring(0, 200) + "...",
      filename: doc.metadata?.filename,
      similarity: doc.similarity,
    })),
  };
}

/**
 * Delete all documents (for testing/cleanup)
 */
export async function clearDocuments() {
  console.log("[CLEANUP] Clearing all documents from database...");
  const { error } = await supabase.from("documents").delete().neq("id", 0);
  if (error) {
    console.error("[CLEANUP] ✗ Failed to clear documents:", error.message);
    throw new Error(`Failed to clear documents: ${error.message}`);
  }
  console.log("[CLEANUP] ✓ All documents cleared");
  return { success: true };
}
