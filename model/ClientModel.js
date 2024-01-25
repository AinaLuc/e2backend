const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: String,
  email: String,
  firstEmail:Boolean,
  secondEmail:Boolean,
  createdAt: { type: Date, default: Date.now }, // Add createdAt field with default value
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
