// app.js or server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const categoryRoutes = require('./routes/categories'); // Add this line
const db = require('./config/db');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route setup
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/categories', categoryRoutes); // Add this line

const PORT = 8801;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Basic route to test server is working
app.get('/', (req, res) => {
  res.send('Server is running');
});
