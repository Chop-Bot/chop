const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teraTwitterSchema = new mongoose.Schema({
  date: { type: Schema.Types.Date, required: true, default: Date.now },
  latestTweetID: { type: String, required: true },
});

teraTwitterSchema.statics.getLatest = function getLatest() {
  return this.find()
    .sort({ date: -1 })
    .limit(1);
};

teraTwitterSchema.statics.getOldest = function getOldest() {
  return this.find()
    .sort({ date: 1 })
    .limit(1);
};

module.exports = mongoose.model('TeraTweet', teraTwitterSchema);
