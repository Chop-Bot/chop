const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const logError = require('../util/logError');

const suggestionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
    default: '',
  },
  time: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
