const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  sharedBy:  { type: String, default: null },
  visitedAt: { type: Date,   default: Date.now },
  userAgent: { type: String },
});

// Guard against model recompilation in serverless hot reloads
const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);

module.exports = Visit;
