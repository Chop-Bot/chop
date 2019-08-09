const { RichEmbed } = require('discord.js');

const log = require('../../config/log');
const parseUrl = require('../../services/tera-general/parseUrl');
const fetchNews = require('../../services/tera-news/fetchNews');

module.exports = {
  name: 'news',
  description: 'Fetch the latest tera news.',
  execute: async (message, args) => {
    const start = Date.now();
    log.debug('[Tera/News] Fetching news...');

    const news = await fetchNews();

    const embed = new RichEmbed();

    embed.setDescription('**Latest Tera News (NA)**');

    news.forEach((n) => {
      embed.addField(`📑 ${n.title}`, `[Click here to read](${parseUrl(n.href)}})`);
    });

    log.debug('[Tera/News] Done! Finished in', Date.now() - start, 'ms');

    message.channel.send(embed);
  },
};
