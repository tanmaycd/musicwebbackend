// // routes/playlistsRoutes.js
// import express from 'express';
// import db from './db.js';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized: Missing token' });
//   }

//   jwt.verify(token, 'your_secret_key', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//     }
//     req.user = decoded; // Store decoded token payload in request object
//     next();
//   });
// };

// // Create a new playlist
// router.post('/create', verifyToken, async (req, res) => {
//   const { name } = req.body;
//   const user_id = req.user.userId; // Extract userId from token payload

//   try {
//     const createPlaylistQuery = 'INSERT INTO playlists (user_id, name) VALUES ($1, $2) RETURNING id';
//     const result = await db.query(createPlaylistQuery, [user_id, name]);

//     res.status(201).json({ message: 'Playlist created', playlistId: result.rows[0].id });
//   } catch (error) {
//     console.error('Error creating playlist:', error);
//     res.status(500).json({ message: 'An error occurred while creating the playlist' });
//   }
// });

// // Get user's playlists
// router.get('/', verifyToken, async (req, res) => {
//   const user_id = req.user.userId; // Extract userId from token payload

//   try {
//     const getPlaylistsQuery = 'SELECT * FROM playlists WHERE user_id = $1';
//     const { rows } = await db.query(getPlaylistsQuery, [user_id]);

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Error retrieving playlists:', error);
//     res.status(500).json({ message: 'An error occurred while retrieving playlists' });
//   }
// });

// // Add song to playlist
// router.post('/add-song', verifyToken, async (req, res) => {
//   const { playlist_id, song_id } = req.body;

//   try {
//     const addSongQuery = 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)';
//     await db.query(addSongQuery, [playlist_id, song_id]);

//     res.status(201).json({ message: 'Song added to playlist' });
//   } catch (error) {
//     console.error('Error adding song to playlist:', error);
//     res.status(500).json({ message: 'An error occurred while adding song to playlist' });
//   }
// });

// // Remove song from playlist
// router.delete('/remove-song', verifyToken, async (req, res) => {
//   const { playlist_id, song_id } = req.body;

//   try {
//     const removeSongQuery = 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2';
//     await db.query(removeSongQuery, [playlist_id, song_id]);

//     res.status(200).json({ message: 'Song removed from playlist' });
//   } catch (error) {
//     console.error('Error removing song from playlist:', error);
//     res.status(500).json({ message: 'An error occurred while removing song from playlist' });
//   }
// });

// export default router;
import express from 'express';
import db from './db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token.split(' ')[1], 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded; // Store decoded token payload in request object
    next();
  });
};



// Create a new playlist
router.post('/create', verifyToken, async (req, res) => {
  const { name } = req.body;
  const user_id = req.user.userId; // Extract userId from token payload

  try {
    const createPlaylistQuery = 'INSERT INTO playlists (user_id, name) VALUES ($1, $2) RETURNING id';
    const result = await db.query(createPlaylistQuery, [user_id, name]);

    res.status(201).json({ message: 'Playlist created', playlistId: result.rows[0].id });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'An error occurred while creating the playlist' });
  }
});


// Get user's playlists
router.get('/', verifyToken, async (req, res) => {
  const user_id = req.user.userId; // Extract userId from token payload

  try {
    const getPlaylistsQuery = 'SELECT * FROM playlists WHERE user_id = $1';
    const { rows } = await db.query(getPlaylistsQuery, [user_id]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving playlists:', error);
    res.status(500).json({ message: 'An error occurred while retrieving playlists' });
  }
});

// Get songs in a specific playlist
router.get('/:playlistId', verifyToken, async (req, res) => {
  const { playlistId } = req.params;

  try {
    const getPlaylistSongsQuery = `
      SELECT songs.* FROM songs 
      JOIN playlist_songs ON songs.id = playlist_songs.song_id 
      WHERE playlist_songs.playlist_id = $1
    `;
    const { rows } = await db.query(getPlaylistSongsQuery, [playlistId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving playlist songs:', error);
    res.status(500).json({ message: 'An error occurred while retrieving playlist songs' });
  }
});

// Add song to playlist
router.post('/add-song', verifyToken, async (req, res) => {
  const { playlist_id, song_id } = req.body;

  try {
    const addSongQuery = 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)';
    await db.query(addSongQuery, [playlist_id, song_id]);

    res.status(201).json({ message: 'Song added to playlist' });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ message: 'An error occurred while adding song to playlist' });
  }
});


// Get songs in a specific playlist
router.get('/api/playlists/:playlistId', verifyToken, async (req, res) => {
  const { playlistId } = req.params;

  try {
    const getPlaylistSongsQuery = `
      SELECT songs.* FROM songs 
      JOIN playlist_songs ON songs.id = playlist_songs.song_id 
      WHERE playlist_songs.playlist_id = $1
    `;
    const { rows } = await db.query(getPlaylistSongsQuery, [playlistId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving playlist songs:', error);
    res.status(500).json({ message: 'An error occurred while retrieving playlist songs' });
  }
});




// Remove song from playlist
router.delete('/remove-song', verifyToken, async (req, res) => {
  const { playlist_id, song_id } = req.body;

  try {
    const removeSongQuery = 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2';
    await db.query(removeSongQuery, [playlist_id, song_id]);

    res.status(200).json({ message: 'Song removed from playlist' });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ message: 'An error occurred while removing song from playlist' });
  }
});
router.delete('/api/playlists/:id', verifyToken, async (req, res) => {
  const userId = req.user.userId; // Extract userId from token payload
  const { id } = req.params; // Get playlist id from route parameters
  console.log('Attempting to delete playlist with ID:', id);
  console.log('For user ID:', userId);

  try {
    // First, delete all songs from the playlist
    const deleteSongsQuery = 'DELETE FROM playlist_songs WHERE playlist_id = $1';
    await db.query(deleteSongsQuery, [id]);

    // Then, delete the playlist itself
    const deletePlaylistQuery = 'DELETE FROM playlists WHERE id = $1 AND user_id = $2';
    const result = await db.query(deletePlaylistQuery, [id, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Playlist not found or you do not have permission to delete this playlist' });
    }

    res.status(204).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'An error occurred while deleting the playlist' });
  }
});











export default router;
