// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware

const cron = require('node-cron');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Client = require('./model/ClientModel');
const EmailService = require('./emailService');


// Define the MongoDB connection string based on the environment
const mongoConnectionString = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_PROD_URI
  : process.env.MONGODB_DEV_URI;

// Connect to MongoDB
mongoose.connect(mongoConnectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.use(cors());

//Schedule the cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const usersToRelance = await Client.find({
      createdAt: { $lt: twentyFourHoursAgo },
      firstEmail: { $exists: false }    });

    console.log('Users to Relance:', usersToRelance);

    for (const user of usersToRelance) {
      console.log('Sending relance email to user:', user.email);
      
      // Send the new E2 visa refusal email after 24 hours
      const refusalTemplate = 'e2RefusalReason.ejs';
      const refusalTitle = 'Main Reason for E2 Visa Application Refusal';
      await EmailService.send(user.email, refusalTemplate, refusalTitle, { firstName: user.firstName });

      // Update the firstEmail field to true after sending the email
      // Note: This line assumes you have an _id field in your ClientModel
      await Client.findByIdAndUpdate(user._id, { $set: { firstEmail: true } });
    }
  } catch (error) {
    console.error('Error in relance cron job:', error);
  }
});




// Another cron job to run every 5 minutes
cron.schedule('*/3 * * * *', async () => {
  try {
    // Calculate the timestamp for 48 hours ago
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const usersToEncourage = await Client.find({
      firstEmail: true,
      secondEmail: { $exists: false } ,
      createdAt: { $lt: fortyEightHoursAgo },
    });

    console.log('Users to Encourage:', usersToEncourage);

    for (const user of usersToEncourage) {
      console.log('Sending encouragement email to user:', user.email);

      // Send the encouragement email
      const encouragementTemplate = 'encouragement.ejs';
      const encouragementTitle = 'Save Thousands of Dollars on Your E2 Petition';
      await EmailService.send(user.email, encouragementTemplate, encouragementTitle, { firstName: user.firstName });

      // Update the secondEmail field to true after sending the email
      // Note: This line assumes you have an _id field in your ClientModel
      await Client.findByIdAndUpdate(user._id, { $set: { secondEmail: true } });
    }
  } catch (error) {
    console.error('Error in encouragement cron job:', error);
  }
});





// Endpoint for handling form submissions
app.post('/submitForm', async (req, res) => {
   try {
    const { firstName, email } = req.body;

    // Save client details to the 'clients' collection
    const client = new Client({ firstName, email });
    await client.save();

    // Respond with success
    res.json({ success: true });

    // Send the E2 Visa step-by-step guide email
    const dynamicTemplate = 'welcome.ejs';
    const title = 'E2 Visa Step-by-Step Guide';
    await EmailService.send(email, dynamicTemplate, title, { firstName });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.json({ success: false, error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
