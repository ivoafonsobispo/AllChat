const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Use port 3000 by default, or use the one specified in the environment variable
const KEY = process.env.GOOGLE_CLIENT_ID; 
//make KEY available in all javascript

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/env/KEY', (req, res) => {
	res.json({ KEY: KEY, PORT: PORT});
  });// Define routes
// ----- Index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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


