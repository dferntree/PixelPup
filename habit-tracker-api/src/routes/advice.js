const express = require('express')
const OpenAI = require('openai')

const router = express.Router()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

router.post('/', async (req, res) => {
    try {
        const { taskContent, conversationHistory } = req.body
        //accepts both taskContent for context and user's custom message

        const systemMessage = {
            role: "system",
            content: `You are a helpful productivity coach for PixelPup. Give brief, encouraging advice based on the user's tasks. Be supportive and specific.\n\nCurrent tasks:\n${taskContent}`
        }

        const messages = [systemMessage, ...conversationHistory]

        const completion = await openai.chat.completions.create({ //call OpenAI API to generate chat completion
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 200, //max size of responses
            temperature: 0.7 // between 0 (deterministic) and 1 (creative)
        })
        res.json({ advice: completion.choices[0].message.content})
    
    } catch (error) {
        console.error('AI advice error:', error)
        res.status(500).json({ error: 'Failed to generate advice' })
    }
})

module.exports = router