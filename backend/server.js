const express = require("express");
const cors = require("cors");
const path = require("path")
const OpenAI = require("openai");
var session = require("express-session");

const dotenv = require("dotenv")
dotenv.config()

const app = express();
const defaultPort = 3000;

// Pick up environment variables (if they exist)
const API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || defaultPort;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, "public")));

// Serve node_modules from the "node_modules" directory
// app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// Session setup
app.use(
    session({
        secret: "something-secret",
        resave: false,
        saveUninitialized: true,
    })
);

// OpenAI configuration
const openai = new OpenAI({ apiKey: API_KEY });

// ===== OPENAI ROUTES =====

app.post("/api/openai/completion", async (req, res) => {
    try {
        const prompt = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: prompt
        });

        console.log("Completion:", completion);
        res.json({ message: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ===== APOD ROUTES =====

app.get("/api/apod", async (req, res) => {
    try {
        const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});