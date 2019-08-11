const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  guild: { type: String, required: true, unique: true },
  teraStatus: {
    notify: { type: Boolean, default: false },
    servers: { type: [String], default: [] },
    channel: { type: String },
  },
  teraNews: {
    notify: { type: Boolean, default: false },
    platforms: { type: [String], default: [] },
    channel: { type: String },
  },
});

/* Creators */
notificationSchema.statics.createByType = function createByType(guild, type, input) {
  if (!['status', 'news'].includes(type)) throw new Error('Invalid type for Notification creation.');
  if (!guild) throw new Error('You must specify a guild for Notification creation');
  if (!input) throw new Error('You must specify input for Notification creation');
  const options = { guild };
  if (type === 'status') options.teraStatus = { ...input };
  if (type === 'news') options.teraNews = { ...input };
  // eslint-disable-next-line new-cap
  const newEntry = new mongoose.model('Notification')({
    ...options,
  });
  return newEntry.save();
};

/* Setters */
notificationSchema.methods.updateByStatus = function updateByStatus({ notify, servers, channel }) {
  const updated = {};
  if (notify !== undefined) updated.notify = notify;
  if (servers !== undefined) updated.servers = servers;
  if (channel !== undefined) updated.channel = channel;

  this.teraStatus = {
    ...this.teraStatus,
    ...updated,
  };
};

notificationSchema.methods.updateByNews = function updateByNews({ notify, platforms, channel }) {
  const updated = {};
  if (notify !== undefined) updated.notify = notify;
  if (platforms !== undefined) updated.platforms = platforms;
  if (channel !== undefined) updated.channel = channel;

  this.teraNews = {
    ...this.teraNews,
    ...updated,
  };
};

/* Getters */
notificationSchema.statics.statusByServers = function statusByServer(servers) {
  const q = servers.map(s => ({ 'teraStatus.servers': s }));
  return this.find({ 'teraStatus.notify': true }).or(q);
};

notificationSchema.statics.newsByPlatforms = function newsByPlatform(platforms) {
  const q = platforms.map(s => ({ 'teraNews.platforms': s }));
  return this.find({ 'teraNews.notify': true }).or(q);
};

notificationSchema.statics.findOneByGuild = function findByGuild(guild) {
  return this.findOne({ guild });
};

/* Updaters */
notificationSchema.statics.findAndUpdateStatus = function findAndUpdateStatus(
  guild,
  { notify, servers, channel },
) {
  const updated = {};
  if (notify !== undefined) updated.notify = notify;
  if (servers !== undefined) updated.servers = servers;
  if (channel !== undefined) updated.channel = channel;

  return this.findOneAndUpdate({ guild }, { teraStatus: updated });
};

notificationSchema.statics.findAndUpdateNews = function findAndUpdateNews(
  guild,
  { notify, platforms, channel },
) {
  const updated = {};
  if (notify !== undefined) updated.notify = notify;
  if (platforms !== undefined) updated.platforms = platforms;
  if (channel !== undefined) updated.channel = channel;

  return this.findOneAndUpdate({ guild }, { teraNews: updated });
};

notificationSchema.statics.disableByType = function disableByType(guild, type) {
  if (!['status', 'news'].includes(type)) throw new Error('Invalid type for Notification creation.');
  if (!guild) throw new Error('You must specify a guild for Notification creation');
  const query = {};
  if (type === 'status') query['teraStatus.notify'] = false;
  if (type === 'news') query['teraNews.notify'] = false;
  return this.findOneAndUpdate({ guild }, query);
};

module.exports = mongoose.model('Notification', notificationSchema);
