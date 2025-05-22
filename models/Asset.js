const mongoose = require('mongoose');
const assetSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  location: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  filepath: String,
  lat: String,
  long: String
});
module.exports = mongoose.model('Asset', assetSchema);
