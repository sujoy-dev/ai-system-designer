# AI System Design Generator 🚀

An intelligent, multi-step deterministic LLM pipeline that automatically converts natural language prompts into production-ready system architecture artifacts. 

Instead of acting as a generic chatbot, this tool uses a deterministic 3-step pipeline to extract structured requirements, design technical components, and output directly usable diagrams and schemas.

## Features ✨

* **Deterministic LLM Pipeline**: Strictly typed JSON schemas for reliable output generation, avoiding hallucinated formats.
* **Architecture Visualization**: Automatically generates and renders full system designs using **PlantUML**.
* **SQL Schema Generation**: Creates exact PostgreSQL DDL definitions for the system's databases.
* **OpenAPI Specs**: Generates robust, valid OpenAPI 3.0.0 YAML specifications for the designed microservices/backends.
* **Premium Dashboard**: A beautiful, glassmorphism-inspired UI with code highlighting and diagram zooming built on Tailwind CSS v4.

## Tech Stack 🛠️

* **Framework:** Next.js 15 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS v4, custom CSS Animations
* **LLM Orchestration:** LangChain (`@langchain/groq`, `@langchain/core`)
* **LLM Provider:** Groq (`llama-3.3-70b-versatile` for blazing-fast inference)
* **Database Strategy:** Neon Serverless Postgres
* **ORM:** Drizzle ORM
* **Schema Validation:** Zod
* **Visualizer:** PlantUML (via public API encoder)

## Architecture Overview 🧠

The application follows a strictly sequenced LangChain pipeline triggered via the `/api/generate` endpoint:

1. **Step 1 - Requirements Extraction**: The user's prompt is parsed into a structured `RequirementsSchema` (Zod), standardizing functional/non-functional needs and user roles.
2. **Step 2 - Component Design**: Based on requirements, the LLM outputs a structured `ComponentsSchema` defining scalable microservices, databases, and network connections.
3. **Step 3 - Artifact Generation**: The components JSON is used as context to generate three parallel artifacts: 
   - A raw PlantUML string (which is deflate-encoded and rendered as an SVG)
   - A PostgreSQL DDL schema
   - An OpenAPI 3.0 YAML specification

Generated designs are asynchronously persisted to the Neon Postgres database so they can be viewed and shared via unique URLs (`/results/[id]`).

## Getting Started 🚀

### Prerequisites
* Node.js v20+
* A Free [Groq Cloud Account](https://console.groq.com/keys) for the API Key.
* A Free [Neon Database Account](https://neon.tech/) for Postgres hosting.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/sujoy-dev/ai-system-designer.git
cd ai-system-designer
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
\`\`\`env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgres://your_user:your_password@your_neon_host.neon.tech/your_db?sslmode=require
PLANTUML_SERVER=https://www.plantuml.com/plantuml
\`\`\`

### 4. Push Database Schema
Sync the Drizzle ORM schema with your Neon Postgres database:
\`\`\`bash
npm run db:push
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage 💡

1. Navigate to the main landing page.
2. Provide a descriptive prompt (e.g., *"Design a ticket booking system for large stadium events handling huge traffic spikes. Must include payments and a queue system."*)
3. Click "Generate System Design".
4. The system will extract your requirements, build the architecture, and present you with the System Architecture Dashboard containing your diagram and code snippets.
