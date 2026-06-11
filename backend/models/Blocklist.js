const mongoose = require('mongoose');

const blocklistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  reason: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Blocklist', blocklistSchema);