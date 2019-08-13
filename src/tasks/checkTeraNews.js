const Task = require('../Task');

const log = require('../config/log');
const logError = require('../util/logError');
const TeraNews = require('../models/teraNews');
const Notification = require('../models/notification');
const fetchNews = require('../services/tera-news/fetchNews');
// const fetchFakeNews = require('../services/tera-news/fetchFakeNews');
const parseUrl = require('../services/tera-general/parseUrl');
const fetchPage = require('../services/tera-general/fetchPage');
const buildEmbed = require('../services/tera-news/buildEmbed');
const getSummary = require('../services/tera-news/getSummary');

const hasDifference = (oldPost, newPost) => {
  const sameTitle = oldPost.title === newPost.title;
  const sameLink = oldPost.href === newPost.href;
  return !sameTitle || !sameLink;
};

const getCurrentAndOldNews = async () => {
  let current = null;
  try {
    current = await fetchNews(null, true);
    // current = await fetchFakeNews();
  } catch (err) {
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
};

module.exports = class extends Task {
  constructor() {
    // check tera news every 30 seconds
    super('CheckNews', 'repeat', '*/30 * * * * *');
  }

  async run() {
    // get current and old posts, return if it fails
    const [currentNews, oldNews] = await getCurrentAndOldNews();
    if (!currentNews || !oldNews) return;

    // check if the latest post is different, return if not
    const isThereANewPost = hasDifference(oldNews[0], currentNews[0]);
    if (!isThereANewPost) return;
    log.info('[Task/CheckNews] New post detected, preparing to notify.');

    const newPost = currentNews[0];

    // get the guilds that want notification for changed servers in a Map<guildId, channelId>
    const guildsToNotify = new Map();
    const notificationSettings = await Notification.guildsWithNewsNotifications();
    notificationSettings.forEach(n => guildsToNotify.set(n.guild, n.teraNews.channel));
    log.info(`[Task/CheckNews] Found ${guildsToNotify.size} guilds to notify.`);

    // send notifications
    guildsToNotify.forEach((channelId, guildId) => {
      const guild = this.client.guilds.get(guildId);
      if (!guild) return;
      const channel = guild.channels.get(channelId);
      if (!channel) return;
      // crawl the post page and get info about it
      fetchPage(parseUrl(newPost.href), 30 * 60)
        .then((html) => {
          const postSummary = getSummary(html);
          const embed = buildEmbed({ ...newPost, ...postSummary });
          try {
            channel.send(embed);
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
            `[Task/CheckNews] Could not fetch summary for new post at ${parseUrl(newPost.href)}`,
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
};
