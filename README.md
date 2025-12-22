# 🧠 Codexa - AI Code Explainer

An AI-powered code explanation application with **RAG (Retrieval-Augmented Generation)** capabilities. Upload your code files and ask questions about them, or paste code directly for instant explanations.

![Codexa Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 🔄 Dual Modes

- **Code Mode**: Paste any code snippet and get beginner-friendly explanations
- **RAG Mode**: Upload code files and ask context-aware questions about them

### 🚀 Technical Highlights

- **True Token Streaming**: Real-time LLM responses token-by-token
- **Vector Search**: Semantic similarity search using Supabase pgvector
- **Conversation Memory**: Maintains context from last 10 messages
- **Multi-file Support**: Upload `.py`, `.js`, `.jsx`, `.cpp`, `.go`, `.rs` files

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React + Vite  │────▶│  Express.js API │────▶│    Supabase     │
│   (Frontend)    │     │   (Backend)     │     │   (pgvector)    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Nebius AI     │
                        │ (Llama 3.3 70B) │
                        └─────────────────┘
```

| Component  | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React 19, Vite, TailwindCSS 4           |
| Backend    | Express.js 5, LangChain                 |
| Database   | Supabase (PostgreSQL + pgvector)        |
| LLM        | Llama-3.3-70B-Instruct via Nebius API   |
| Embeddings | Xenova/multilingual-e5-small (384 dims) |
| Structure  | Yarn Workspaces Monorepo                |

---

## 📋 Prerequisites

- **Node.js** >= 18.x
- **Yarn** >= 4.x
- **Supabase** account with pgvector enabled
- **Nebius API** key (or compatible OpenAI endpoint)

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-code-explainer.git
cd ai-code-explainer
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

Create `.env` file in `apps/server/`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Nebius AI (LLM)
NEBIUS_API_KEY=your-nebius-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Server Port
PORT=8080
```

Create `.env` file in `apps/web/`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Set up Supabase Database

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(384),
  metadata JSONB DEFAULT '{}'::jsonb,
  session_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector index for fast similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create match_documents function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(384),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.75
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chats table
CREATE TABLE chats (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New chat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  chat_id BIGINT REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Running Locally

### Development Mode (with hot reload)

```bash
# Terminal 1 - Start backend
yarn dev:server

# Terminal 2 - Start frontend
yarn dev:web
```

### Production Mode

```bash
# Start backend
yarn start:server

# Start frontend (in another terminal)
yarn start:web
```

The app will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080

---

## 📁 Project Structure

```
ai-code-explainer/
├── apps/
│   ├── db/                 # Supabase client
│   │   └── supabase.js
│   ├── server/             # Express.js backend
│   │   ├── server.js       # Main API server
│   │   ├── env_setup.js    # Environment configuration
│   │   └── .env            # Server environment variables
│   ├── services/           # Business logic
│   │   ├── rag.js          # RAG pipeline (embeddings, search, LLM)
│   │   ├── chat_services.js # Chat & session management
│   │   └── cleanup.js      # Scheduled cleanup cron jobs
│   └── web/                # React frontend
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── App.jsx     # Main app component
│       │   └── main.jsx    # Entry point
│       └── .env            # Frontend environment variables
├── package.json            # Root package.json (workspaces)
└── yarn.lock
```

---

## 🔌 API Endpoints

| Method   | Endpoint                     | Description                  |
| -------- | ---------------------------- | ---------------------------- |
| `POST`   | `/api/explain-code`          | Explain code snippet         |
| `POST`   | `/api/upload-code`           | Upload code file for RAG     |
| `POST`   | `/api/query-rag`             | Query uploaded documents     |
| `POST`   | `/api/chat/session`          | Get/create session           |
| `POST`   | `/api/chat/new`              | Create new chat              |
| `POST`   | `/api/chat/send`             | Send message (non-streaming) |
| `POST`   | `/api/chat/send-stream`      | Send message (streaming)     |
| `GET`    | `/api/chat/:chatId/messages` | Get chat messages            |
| `DELETE` | `/api/chat/:chatId`          | Delete a chat                |
| `DELETE` | `/api/documents`             | Delete a document            |
| `GET`    | `/api/health`                | Health check                 |

---

## 🔧 Configuration Options

### File Upload Limits

- **Max file size**: 500KB (configurable in `ChatInterface.jsx`)
- **Allowed extensions**: `.py`, `.js`, `.jsx`, `.cpp`, `.go`, `.rs`

### Rate Limiting

- 100 requests per 15 minutes per IP

### LLM Settings

Located in `rag.js`:

```javascript
{
  model: "meta-llama/Llama-3.3-70B-Instruct-fast",
  temperature: 0.3,
  maxTokens: 800,
  timeout: 60000,
}
```

---

## 🚢 Deployment

### Railway

1. Create two services: `web` and `server`
2. Set environment variables in Railway dashboard
3. Deploy from GitHub

### Vercel (Frontend only)

```bash
cd apps/web
vercel deploy
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ by **Raihan Rizky**

---

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) - LLM orchestration
- [Supabase](https://supabase.com/) - Database & pgvector
- [Nebius AI](https://nebius.ai/) - LLM inference
- [Xenova Transformers](https://github.com/xenova/transformers.js) - Local embeddings
