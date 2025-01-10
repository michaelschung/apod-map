const express = require('express');

module.exports = (openai) => {
    const router = express.Router();

    router.post("/completion", async (req, res) => {
        try {
            const prompt = req.body;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: prompt
            });

            console.log("Completion received");
            const content = completion.choices[0].message.content;
            // console.log(content);
            res.json(content);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });

    return router;
};