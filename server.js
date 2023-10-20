const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.post('/generate-comment', async (req, res) => {
    const { prompt } = req.body;

    const requestBody = {
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.5,
    };

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
    };

    try {
        const response = await axios.post("https://api.openai.com/v1/engines/text-davinci-003/completions", requestBody, config);
        res.json(response.data.choices[0].text.trim());
    } catch (error) {
        res.status(500).json({ error: 'Error generating comment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
