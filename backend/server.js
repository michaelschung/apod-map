const express = require("express");
const cors = require("cors");
const path = require("path")
const OpenAI = require("openai");
var session = require("express-session");

const dotenv = require("dotenv")
dotenv.config()

const app = express();
const defaultPort = 3000;

// Pick up environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const NASA_API_KEY = process.env.NASA_API_KEY;
const PORT = process.env.PORT || defaultPort;

// Middleware
app.use(cors());
app.use(express.json());

// Session setup
app.use(
    session({
        secret: "something-secret",
        resave: false,
        saveUninitialized: true,
    })
);

// OpenAI configuration
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ===== API ROUTES =====
const openaiRoutes = require("./routes/openai");
const apodRoutes = require("./routes/apod");
app.use("/api/openai", openaiRoutes(openai));
app.use("/api/apod", apodRoutes(NASA_API_KEY));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});