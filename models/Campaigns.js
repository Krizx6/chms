const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
  title: String,
  messege: String,
});
module.exports = mongoose.model('Campaign', campaignSchemaSchema);