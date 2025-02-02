import express from "express";

export default (llm, useClaude) => {
    const router = express.Router();

    router.post("/completion", async (req, res) => {
        try {
            const prompt = req.body;

            const completion = useClaude
                ? await llm.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1024,
                    system: prompt[0]["content"],
                    messages: prompt.slice(1)
                })
                : await llm.chat.completions.create({
                    model: "gpt-4o",
                    messages: prompt
                });
            
            console.log("Completion received");
            const content = useClaude
                ? completion.content[0].text
                : completion.choices[0].message.content;
            res.json(content);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });

    return router;
};