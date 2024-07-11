



// Example using JWT for authentication in authRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import db from './db.js';

const router = express.Router();

// Signup route
// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     // Check if username or email already exists
//     const checkUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
//     const { rows } = await db.query(checkUserQuery, [username, email]);

//     if (rows.length > 0) {
//       return res.status(409).json({ message: 'Username or email already exists' });
//     }
     
//     // Insert user into database
//     const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
//     const result = await db.query(insertUserQuery, [username, email, password]);

//     const userId = result.rows[0].id;

//     // Generate JWT token
//     const token = jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });

//     res.status(201).json({ message: 'User registered successfully', token });
//   } catch (error) {
//     console.error('Error signing up:', error);
//     res.status(500).json({ message: 'An error occurred while signing up' });
//   }
// });
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Example validation for email format
  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Invalid email format. Only @gmail.com addresses are allowed.' });
  }

  try {
    // Check if username or email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1 OR email = $2';
    const { rows } = await db.query(checkUserQuery, [username, email]);

    if (rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
     
    // Insert user into database
    const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const result = await db.query(insertUserQuery, [username, email, password]);

    const userId = result.rows[0].id;

    // Generate JWT token
    const token = jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'An error occurred while signing up' });
  }
});




// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await db.query(checkUserQuery, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Verify password
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
});

export default router;
