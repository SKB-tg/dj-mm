// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Разрешаем запросы с фронтенда (в dev — localhost:4000, в prod — ваш домен)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4000'
}));
// Сервим статику из client/dist
app.use(express.static(join(__dirname, '../client/dist')));
app.use(express.json());

// Эндпоинт: получить все треки
// app.get('/api/tracks', async (req, res) => {
  // try {
    // const result = await pool.query(`
      // SELECT id, title, artist, album, year, url, playlist_name
      // FROM tracks
      // ORDER BY playlist_name, title
    // `);
    Группируем по плейлистам
    // const playlists = {};
    // result.rows.forEach(row => {
      // if (!playlists[row.playlist_name]) {
        // playlists[row.playlist_name] = [];
      // }
      // playlists[row.playlist_name].push({
        // id: row.id,
        // title: row.title,
        // artist: row.artist,
        // album: row.album,
        // year: row.year,
        // url: row.url,
		// duration: row.duration
      // });
    // });
    // res.json(playlists);
  // } catch (err) {
    // console.error(err);
    // res.status(500).json({ error: 'Ошибка базы данных' });
  // }
// });


// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});
// Health-check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎵 Сервер запущен на http://localhost:${PORT}`);
});
