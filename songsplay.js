// routes/songsRoutes.js
import express from 'express';
import db from './db.js';

const router = express.Router();

// Get all songs or search for songs by title or artist
router.get('/', async (req, res) => {
  const searchTerm = req.query.searchTerm;
  let getSongsQuery = 'SELECT * FROM songs';
  let queryParams = [];

  if (searchTerm) {
    getSongsQuery += ' WHERE title ILIKE $1 OR artist ILIKE $2';
    queryParams = [`%${searchTerm}%`, `%${searchTerm}%`];
  }

  try {
    const { rows } = await db.query(getSongsQuery, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving songs:', error);
    res.status(500).json({ message: 'An error occurred while retrieving songs' });
  }
});

// Get song by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const getSongQuery = 'SELECT * FROM songs WHERE id = $1';
    const { rows } = await db.query(getSongQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Song not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error retrieving song:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the song' });
  }
});

export default router;
