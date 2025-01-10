const express = require('express');

module.exports = (NASA_API_KEY) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const url = new URL("https://api.nasa.gov/planetary/apod");
        // Add API key to the URL
        url.searchParams.append("api_key", NASA_API_KEY);
        url.searchParams.append("thumbs", true);
        // Pass along any query parameters
        for (const key in req.query) {
            url.searchParams.append(key, req.query[key]);
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });

    return router;
};