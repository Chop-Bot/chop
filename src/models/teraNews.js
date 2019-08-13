const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teraNewsSchema = new Schema({
  date: { type: Schema.Types.Date, required: true, default: Date.now },
  news: [
    {
      title: { type: String, required: true },
      platforms: [{ type: String, required: true }],
      href: { type: String, required: true },
    },
  ],
});

teraNewsSchema.statics.getLatest = function getLatest() {
  return this.find()
    .sort({ date: -1 })
    .limit(1);
};

teraNewsSchema.statics.getOldest = function getOldest() {
  return this.find()
    .sort({ date: 1 })
    .limit(1);
};

module.exports = mongoose.model('TeraNews', teraNewsSchema);
