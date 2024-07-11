


// routes/favoritesRoutes.js
import express from 'express';
import db from './db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded; // Store decoded token payload in request object
    next();
  });
};

// Add song to favorites
router.post('/add', verifyToken, async (req, res) => {
  const { song_id } = req.body;
  const user_id = req.user.userId; // Extract userId from token payload

  try {
    // Check if the song is already in favorites for the user
    const checkFavoriteQuery = 'SELECT * FROM favorites WHERE user_id = $1 AND song_id = $2';
    const { rows } = await db.query(checkFavoriteQuery, [user_id, song_id]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Song already in favorites' });
    }

    // Add song to favorites
    const addFavoriteQuery = 'INSERT INTO favorites (user_id, song_id) VALUES ($1, $2)';
    await db.query(addFavoriteQuery, [user_id, song_id]);

    res.status(201).json({ message: 'Song added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'An error occurred while adding to favorites' });
  }
})

// Get user's favorite songs
router.get('/', verifyToken, async (req, res) => {
  const user_id = req.user.userId; // Extract userId from token payload

  try {
    const getFavoritesQuery = 'SELECT songs.* FROM songs JOIN favorites ON songs.id = favorites.song_id WHERE favorites.user_id = $1';
    const { rows } = await db.query(getFavoritesQuery, [user_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    res.status(500).json({ message: 'An error occurred while retrieving favorites' });
  }
});

// Remove song from favorites
router.delete('/remove', verifyToken, async (req, res) => {
  const { song_id } = req.body;
  const user_id = req.user.userId; // Extract userId from token payload

  try {
    const removeFavoriteQuery = 'DELETE FROM favorites WHERE user_id = $1 AND song_id = $2';
    await db.query(removeFavoriteQuery, [user_id, song_id]);

    res.status(200).json({ message: 'Song removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'An error occurred while removing from favorites' });
  }
});

export default router;
