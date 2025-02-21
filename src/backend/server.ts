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
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});