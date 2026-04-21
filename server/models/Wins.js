const mongoose = require('mongoose');

const WinsSchema = new mongoose.Schema({
  division: { type: String, required: true },
  schoolName: { type: String, required: true },
  level: { type: String, required: true },
  stars: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Wins', WinsSchema);