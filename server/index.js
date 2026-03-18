import express from 'express';
var cors = require('cors');
var dotenv = require('dotenv')
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4000'
}));
app.use(express.static(join(__dirname, '../client/dist')));
app.use(express.json());

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎵 Сервер запущен на http://localhost:${PORT}`);
});
