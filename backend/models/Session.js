const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain:       { type: String, required: true },
  duration:     { type: Number, default: 0 },  // in seconds
  date:         { type: String, required: true }, // "2026-06-11"
  isProductive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);