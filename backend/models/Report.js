const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId:              { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:                { type: String, required: true }, // "2026-06-11"
  totalTimeSeconds:    { type: Number, default: 0 },
  productiveSeconds:   { type: Number, default: 0 },
  unproductiveSeconds: { type: Number, default: 0 },
  topSites: [
    {
      domain:   { type: String },
      duration: { type: Number }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);