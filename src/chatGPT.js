import axios from 'axios';

const API_KEY = "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"; // Replace with your actual API key


const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
};

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers,
});

export const generateComment = async (inputs) => {
  const response = await openai.post('/engines/davinci-codex/completions', {
    prompt: `A conversation with AI Report Writer.`,
    documents: [inputs],
    n: 1,
    max_tokens: 150,
    temperature: 0.7,
  });

  const generatedText = response.data.choices[0].text.trim();
  return generatedText;
};
