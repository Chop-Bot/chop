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

    // const response = [
    //   '**Latest Tera News (NA)**\n',
    //   ...news.map(n => `📑 ${n.title}\n ${parseUrl(n.href)}\n`),
    // ];

    log.debug('[Tera/News] Done! Finished in', Date.now() - start, 'ms');

    message.channel.send(embed);
  },
};

// // read latest post
// fetchPage(parseUrl(news[0].href)).then((html) => {
//   const summary = getSummary(html);
//   log.info('Title:', summary.title);
//   log.info(`Topics (${summary.topics.length}):`, summary.topics);
//   log.info('Image:', summary.img);
// });
