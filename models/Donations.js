const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
  Name: String,
  Amount: String,
  MOP: String,
  Phone: String,
  at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Donations', donationSchema);