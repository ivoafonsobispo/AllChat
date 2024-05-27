const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 by default, or use the one specified in the environment variable

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
// ----- Index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// -----  PM page
app.get('/pm/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'pm.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
