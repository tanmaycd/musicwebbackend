// server.js
import express from 'express';
import bodyParser from 'body-parser';
import  cors from 'cors';
import authRoutes from './loginsignup.js';
import favoritesRoutes from './favorites.js';
import playlistsRoutes from './playlist.js';
import songsRoutes from './songsplay.js';
import path from 'path';


const app = express();
app.use(cors());
app.use(bodyParser.json());



const PORT = 5000;
app.use('/audio', express.static(path.join('C:\\Users\\tanma\\Downloads')));
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/songs', songsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
  });
  // app.get('/audio', (req, res) => {
  //   res.send('Hello World');
  // });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


