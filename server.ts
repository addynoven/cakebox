import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleGeminiChat, handleBakeryLocationSearch } from './src/server/gemini.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API endpoints
app.post('/api/chat', async (req, res) => {
  try {
    const { history = [], message = '', model = 'gemini-3.7-flash' } = req.body;
    const result = await handleGeminiChat(history, message, model);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Gemini error' });
  }
});

app.post('/api/nearby-bakeries', async (req, res) => {
  try {
    const { query = '', userLocation = '' } = req.body;
    const result = await handleBakeryLocationSearch(query, userLocation);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Location error' });
  }
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CakeBox server running on port ${PORT}`);
});
