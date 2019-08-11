const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teraStatusSchema = new Schema({
  date: { type: Schema.Types.Date, required: true, default: Date.now },
  news: [
    {
      title: { type: String, required: true },
      href: { type: String, required: true },
      status: { type: Boolean, required: true },
    },
  ],
});

teraStatusSchema.statics.getLatest = function getLatest() {
  return this.find()
    .sort({ date: -1 })
    .limit(1);
};

teraStatusSchema.statics.getOldest = function getOldest() {
  return this.find()
    .sort({ date: 1 })
    .limit(1);
};

module.exports = mongoose.model('TeraStatus', teraStatusSchema);
