const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
  campaignTitle: String,
  campaignMessege: String,
});
module.exports = mongoose.model('Campaign', campaignSchema);