import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/api/quiz', async (req, res) => {
  const response = await fetch('https://api.jsonserve.com/Uw5CrX');
  const data = await response.json();
  res.json(data);
});

app.listen(5000, () => console.log('Server running on port 5000'));
