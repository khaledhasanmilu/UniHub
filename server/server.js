const express = require('express');
const path = require('path');
const app = express(); // Initialize express app

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Route for home page (display login page)
app.get('/', (req, res) => {
    console.log("Rendering login page...");
    res.render('login');
});
app.get('/login',(req,res)=>{
    console.log("Rendering login page...");
    res.render('login');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
