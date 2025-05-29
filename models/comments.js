const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  user: String,
  commentMsg: String,
  at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Comments', commentSchema);