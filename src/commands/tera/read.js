const { RichEmbed } = require('discord.js');

const log = require('../../config/log');
const parseUrl = require('../../services/tera-general/parseUrl');
const fetchNews = require('../../services/tera-news/fetchNews');
const getSummary = require('../../services/tera-news/getSummary');
const fetchPage = require('../../services/tera-general/fetchPage');

module.exports = {
  name: 'read',
  description: 'Reads the latest tera news.',
  hidden: true,
  execute: async (message, args) => {
    const news = await fetchNews();

    const embed = new RichEmbed();

    fetchPage(parseUrl(news[0].href)).then((html) => {
      const summary = getSummary(html);
      embed.addField(summary.title, `[Read on Tera Website](${parseUrl(news[0].href)})`);
      embed.addField('Summary', summary.topics.map(t => `▫${t}`));
      embed.setImage(summary.img);
      message.channel.send(embed);
    });
  },
};
