const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    productiveSites:   { type: [String], default: [] },
    unproductiveSites: { type: [String], default: [] },
    dailyGoalHours:    { type: Number, default: 8 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);