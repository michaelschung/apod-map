import express, { static as expressStatic, json } from "express";
import cors from "cors";
import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose, { connect } from "mongoose";

config()

const app = express();
const defaultPort = 3000;

// Pick up environment variables
const useClaude = !!process.env.ANTHROPIC_API_KEY;
const LLM_API_KEY = useClaude
  ? process.env.ANTHROPIC_API_KEY
  : process.env.OPENAI_API_KEY;
const NASA_API_KEY = process.env.NASA_API_KEY;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || defaultPort;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(expressStatic(join(__dirname, "../frontend/dist")));

// Middleware
app.use(cors());
app.use(json());

// OpenAI configuration
const llm = useClaude
  ? new Anthropic({ apiKey: LLM_API_KEY })
  : new OpenAI({ apiKey: LLM_API_KEY });

// Mongo configuration
connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// ===== API routes =====
import openaiRoutes from "./routes/ai.js";
import apodRoutes from "./routes/apod.js";
import mongoRoutes from "./routes/mongo.js";
app.use("/api/openai", openaiRoutes(llm, useClaude));
app.use("/api/apod", apodRoutes(NASA_API_KEY));
app.use("/api/mongo", mongoRoutes(mongoose));

// Start the server
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});