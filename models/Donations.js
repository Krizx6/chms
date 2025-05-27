const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
  name: String,
  amount: String,
  MOP: String,
  phone: String,
  at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Donation', donationSchema);