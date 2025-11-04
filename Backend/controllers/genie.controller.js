import * as genieService from '../services/genie.service.js';

export async function generateContent(req, res) {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    try {
        const result = await genieService.generateContent(prompt);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}