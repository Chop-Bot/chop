const Task = require('../Task');

const log = require('../config/log');
const logError = require('../util/logError');
const TeraStatus = require('../models/teraStatus');
const Notification = require('../models/notification');
const fetchStatus = require('../services/tera-status/fetchStatus');
// const fetchFakeStatus = require('../services/tera-status/fetchFakeStatus');
const buildEmbed = require('../services/tera-status/buildEmbed');

module.exports = class extends Task {
  constructor() {
    // check tera status every 30 seconds
    super('CheckTeraStatus', 'repeat', '*/30 * * * * *');
  }

  async run() {
    // get current and old status, return if it fails
    const [currentStatus, oldStatus] = await this.getCurrentAndOldStatus();
    if (!currentStatus || !oldStatus) return;

    // check if there is change in any of the servers, return if not
    const serversThatChanged = this.getServersThatChanged(
      oldStatus.servers,
      currentStatus.reduce((acc, cur) => [...acc, ...cur.servers], []),
    );
    if (serversThatChanged.length < 1) return;
    log.info('[Task/CheckStatus] Change detected, preparing to notify.');

    // get the guilds that want notification for changed servers in a Map<guildId, channelId>
    const guildsToNotify = new Map();
    const notificationsInDb = await Notification.findAllBySubjects(serversThatChanged, 'status');
    notificationsInDb.forEach(n => guildsToNotify.set(n.guild, n.channel));
    log.info(`[Task/CheckStatus] Found ${guildsToNotify.size} guilds to notify.`);

    // send notifications
    let notificationsSent = 0;
    guildsToNotify.forEach((channelId, guildId) => {
      const guild = this.client.guilds.get(guildId);
      if (!guild) return;
      const channel = guild.channels.get(channelId);
      if (!channel) return;
      const embed = buildEmbed(currentStatus);
      try {
        // FIXME: This will throw if the bot lacks embed permissions
        channel.send(embed);
        notificationsSent += 1;
      } catch (e) {
        log.error(
          "[Task/CheckStatus] Couldn't notify the guild",
          guild.name,
          'at channel:',
          channel.id,
        );
      }
    });

    log.info(`[Task/CheckStatus] Sent ${notificationsSent} notifications.`);

    // update db with new status
    const updatedStatus = new TeraStatus({
      date: new Date(),
      servers: currentStatus.reduce((acc, cur) => [...acc, ...cur.servers], []),
    });
    await updatedStatus.save();
    // done.
  }

  getServersThatChanged(oldServers, newServers) {
    const changed = [];
    oldServers.forEach((s1) => {
      const s2 = newServers.find(s => s.name === s1.name);
      if (s1.status !== s2.status) {
        changed.push(s1.name);
      }
    });
    return changed;
  }

  async getCurrentAndOldStatus() {
    let current = null;
    try {
      current = await fetchStatus();
      // current = await fetchFakeStatus();
    } catch (err) {
      logError('[Task/CheckTeraStatus] Failed to fetch current status.', err);
    }
    let old = null;
    try {
      [old] = await TeraStatus.getLatest();
    } catch (err) {
      logError('[Task/CheckTeraStatus] Failed to get old status from db.', err);
    }
    return [current, old];
  }
};
