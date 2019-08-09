const { MessageEmbed } = require('discord.js');

const log = require('../../config/log');
const parseUrl = require('../../services/tera-general/parseUrl');
const fetchNews = require('../../services/tera-news/fetchNews');
const parseFilter = require('../../services/tera-news/parseFilter');
const getNewsEmojis = require('../../services/tera-news/getNewsEmojis');

module.exports = {
  name: 'news',
  description: 'Fetch the latest tera news.',
  usage: '[filter]',
  execute: async (message, args) => {
    const start = Date.now();
    log.debug('[Tera/News] Fetching news...');

    const filtered = parseFilter([args[0]]);
    const news = await fetchNews(filtered ? filtered[0] : 'ALL');

    const embed = new MessageEmbed();

    embed.setDescription('**Latest Tera News (NA)**');

    news.forEach((n) => {
      embed.addField(
        `${getNewsEmojis(n.platforms)} ${n.title}`,
        `${n.content}[:small_blue_diamond:Read More](${parseUrl(n.href)})\n`,
      );
    });

    // log.debug('[Tera/News] News fetched:', JSON.stringify(news));
    log.debug('[Tera/News] Done! Finished in', Date.now() - start, 'ms');

    message.channel.send(embed);
  },
};
