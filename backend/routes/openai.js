const express = require('express');

module.exports = (openai) => {
    const router = express.Router();
    
    router.post("/completion", async (req, res) => {
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

    return router;
};