const { Task } = require('chop-tools');

const log = require('../config/log');
const logError = require('../util/logError');
const Notification = require('../models/notification');
const TeraTwitter = require('../models/teraTwitter');

module.exports = class extends Task {
  constructor() {
    // check tera news every 30 seconds
    super('CheckTwitter', 'repeat', '*/30 * * * * *');
  }

  async run() {
    // get current and old posts, return if it fails
    const [currentTweet, oldTweet] = await this.getCurrentAndOldTweets();
    if (!currentTweet || !oldTweet) return;
    if (currentTweet === oldTweet) return;

    log.info('[Task/CheckNews] New post detected, preparing to notify.');

    let newTweet;
    try {
      newTweet = await this.client.twitter.getLatestTeraTweetUrl();
    } catch (err) {
      logError('[Task/CheckTwitter] Could not retrieve latest tweet url.', err);
      return;
    }

    // get the guilds that want notification in a Map<guildId, channelId>
    const guildsToNotify = new Map();
    const notificationsInDb = await Notification.findAllByType('twitter');
    notificationsInDb.forEach(n => guildsToNotify.set(n.guild, n.channel));
    log.info(`[Task/CheckNews] Found ${guildsToNotify.size} guilds to notify.`);

    // send notifications
    let sent = 0;
    guildsToNotify.forEach((channelId, guildId) => {
      const guild = this.client.guilds.get(guildId);
      if (!guild) return;
      const channel = guild.channels.get(channelId);
      if (!channel) return;
      // crawl the post page and get info about it
      // FIXME: This will throw if the bot lacks embed permissions
      channel.send(newTweet);
      sent += 1;
    });

    log.info(`[Task/CheckNews] Sent ${sent} notifications.`);

    // update db with new data
    const updatedTwitter = new TeraTwitter({
      date: new Date(),
      latestTweetID: currentTweet,
    });
    await updatedTwitter.save();
    // done.
  }

  async getCurrentAndOldTweets() {
    let current = null;
    try {
      current = await this.client.twitter.getLatestTeraTweetID();
      if (!current) log.warn('[Task/CheckTwitter] Could not get current status.');
    } catch (err) {
      logError('[Task/CheckTwitter] Failed to fetch current twitter.', err);
    }
    let old = null;
    try {
      const latestDbEntry = await TeraTwitter.getLatest();
      old = latestDbEntry[0].latestTweetID;
      if (!old) log.warn('[Task/CheckTwitter] Could not get old status.');
    } catch (err) {
      logError('[Task/CheckTwitter] Failed to get old twitter from db.', err);
    }
    return [current, old];
  }
};
