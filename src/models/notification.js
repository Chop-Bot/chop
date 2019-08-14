const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// NOTE: This is here for future validation
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new Schema({
  guild: { type: String, required: true },
  type: { type: String, required: true },
  subject: { type: [String], default: [] },
  channel: { type: String },
});

/* Creators */
notificationSchema.statics.createNotification = function createNotification({
  guild,
  type,
  subject,
  channel,
}) {
  // eslint-disable-next-line new-cap
  const newEntry = new mongoose.model('Notification')({
    guild,
    type,
    subject,
    channel,
  });
  return newEntry.save();
};

/* Setters */
notificationSchema.statics.updateNotification = function updateNotification({
  guild,
  type,
  newInfo,
}) {
  return this.findOneAndUpdate({ guild, type }, { ...newInfo });
};

/* Getters */
notificationSchema.statics.findOneByGuildAndType = function findOneByGuildAndType({ guild, type }) {
  return this.findOne({ guild, type });
};
notificationSchema.statics.findAllByGuild = function findAllByGuild(guild) {
  return this.find({ guild });
};
notificationSchema.statics.findAllByType = function findAllByType(type) {
  return this.find({ type });
};
notificationSchema.statics.findAllBySubjects = function findAllBySubjects(subjects, type = null) {
  const query = subjects.map(s => ({ subject: s }));
  if (type) {
    return this.find({ type }).or(query);
  }
  return this.find({}).or(query);
};

module.exports = mongoose.model('Notification', notificationSchema);
