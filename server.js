// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for handling form submissions
app.post('/submitForm', async (req, res) => {
  try {
    // Extract form data from the request
    const { firstName, email } = req.body;

    // TODO: Implement your logic for processing the form data here
    // For demonstration purposes, we'll just log the data
    console.log('Received form data:', { firstName, email });

    // Respond with success (you can customize this based on your server logic)
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing form submission:', error);
    // Respond with an error (you can customize this based on your server logic)
    res.json({ success: false, error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
