const express = require('express');
const cors = require('cors');

// PATH FIX: We tell Node to look INSIDE the 'routes' folder
const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes'); // Uncomment this once you create the file

const app = express();

// Middleware
app.use(cors()); // Allows your iOS app to talk to the backend
app.use(express.json()); // Allows the server to read JSON sent in the request body

// Route Mounting
// This makes your signup URL: http://localhost:5000/api/auth/signup
app.use('/api/auth', authRoutes); 

// Health Check Route (To verify the server is alive in your browser)
app.get('/', (req, res) => {
    res.send('🚀 iPlan Backend is live and running!');
});

// CRITICAL: Export the app so server.js can start it
module.exports = app;