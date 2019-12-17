const { Task } = require('chop-tools');

const log = require('../config/log');
const logError = require('../util/logError');
const TeraNews = require('../models/teraNews');
const Notification = require('../models/notification');

const TeraNewsReader = require('../services/tera/TeraNewsReader');
const TeraHelper = require('../services/tera/TeraHelper');

module.exports = class extends Task {
  constructor() {
    // check tera news every 30 seconds
    super('CheckNews', 'repeat', '*/30 * * * * *');
  }

  async run() {
    // get current and old posts, return if it fails
    const [currentNews, oldNews] = await this.getCurrentAndOldNews();
    if (!currentNews || !oldNews) return;

    // check if the latest post is different, return if not
    const isThereANewPost = this.hasDifference(oldNews[0], currentNews[0]);
    if (!isThereANewPost) return;
    log.info('[Task/CheckNews] New post detected, preparing to notify.');

    const newPost = currentNews[0];

    // get the guilds that want notification for changed servers in a Map<guildId, channelId>
    const guildsToNotify = new Map();
    const notificationsInDb = await Notification.findAllBySubjects(
      currentNews[0].platforms,
      'news',
    );
    notificationsInDb.forEach(n => guildsToNotify.set(n.guild, n.channel));
    log.info(`[Task/CheckNews] Found ${guildsToNotify.size} guilds to notify.`);

    // send notifications
    guildsToNotify.forEach((channelId, guildId) => {
      const guild = this.client.guilds.get(guildId);
      if (!guild) return;
      const channel = guild.channels.get(channelId);
      if (!channel) return;
      // crawl the post page and get info about it
      TeraHelper.fetchPage(TeraHelper.parseUrl(newPost.href), 30 * 60)
        .then((html) => {
          const postSummary = TeraNewsReader.crawlSummary(html);
          const embed = TeraNewsReader.buildEmbed({ ...newPost, ...postSummary });
          try {
            // FIXME: This will throw if the bot lacks embed permissions
            channel.send({ embed });
          } catch (e) {
            log.error(
              "[Task/CheckNews] Couldn't notify the guild",
              guild.name,
              'at channel:',
              channel.id,
            );
          }
        })
        .catch((err) => {
          logError(
            `[Task/CheckNews] Could not fetch summary for new post at ${TeraHelper.parseUrl(
              newPost.href,
            )}`,
            err,
          );
        });
    });

    log.info('[Task/CheckNews] Sent the notifications.');

    // update db with new data
    const updatedNews = new TeraNews({
      date: new Date(),
      news: [...currentNews],
    });
    await updatedNews.save();
    // done.
  }

  hasDifference(oldPost, newPost) {
    // Don't check by title because chop got it in a different language once
    // const sameTitle = oldPost.title === newPost.title;
    const sameLink = oldPost.href === newPost.href;
    return !sameLink;
  }

  async getCurrentAndOldNews() {
    let current = null;
    try {
      current = await TeraNewsReader.fetchAndRead(null, true);
    } catch (err) {
      // if the code above throws, the html in the tera website is probably fucked.
      logError('[Task/CheckNews] Failed to fetch current news.', err);
    }
    let old = null;
    try {
      // TODO: Do the same in checkTeraStatus
      const latestDbEntry = await TeraNews.getLatest();
      old = latestDbEntry[0].news;
    } catch (err) {
      logError('[Task/CheckNews] Failed to get old news from db.', err);
    }
    return [current, old];
  }
};
