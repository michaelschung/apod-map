const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const dotenv = require("dotenv")
const path = require("path");

dotenv.config()

const app = express();
const defaultPort = 3000;

// Pick up environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NASA_API_KEY = process.env.NASA_API_KEY;
const PORT = process.env.PORT || defaultPort;

app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ===== API routes =====
const openaiRoutes = require("./routes/openai");
const apodRoutes = require("./routes/apod");
app.use("/api/openai", openaiRoutes(openai));
app.use("/api/apod", apodRoutes(NASA_API_KEY));

// Start the server
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});