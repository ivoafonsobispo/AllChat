const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 by default, or use the one specified in the environment variable

//make KEY available in all javascript
console.log(process.env)

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve environment variables to client-side
app.get('/config', (req, res) => {
    res.json({
        websocketsURL: process.env.WEBSOCKETS_URL,
        chatbackendURL: process.env.CHAT_BACKEND_URL,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        frontendURL: process.env.FRONTEND_URL,
        backendURL: process.env.BACKEND_URL
    });
});

// ----- Index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// -----  PM page
app.get('/pm/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'pm.html'));
});
// -----  Group page
app.get('/group/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'group.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


