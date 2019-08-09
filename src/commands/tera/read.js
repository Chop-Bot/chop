const { MessageEmbed } = require('discord.js');

const log = require('../../config/log');
const parseUrl = require('../../services/tera-general/parseUrl');
const fetchNews = require('../../services/tera-news/fetchNews');
const getSummary = require('../../services/tera-news/getSummary');
const getNewsEmojis = require('../../services/tera-news/getNewsEmojis');
const parseFilter = require('../../services/tera-news/parseFilter');
const fetchPage = require('../../services/tera-general/fetchPage');

const parseOrder = (input, len) => {
  let order = Number.isNaN(Number(input)) ? 1 : Number(input);
  if (order > len || order < 1) {
    order = 1;
  }
  return order - 1;
};

const isValidOrder = (input, len) => {
  const isValidNumber = !Number.isNaN(Number(input));
  if (!isValidNumber) return false;
  const order = parseOrder(input);
  const withinNewsRange = !(order > len || order < 1);
  if (!withinNewsRange) return false;
  return true;
};

module.exports = {
  name: 'read',
  description: 'Reads the summary of a tera news post.',
  usage: '[order|platform] [order] \nExample: `chop read 1´ or `chop read pc 3`',
  cooldown: 5,
  execute: async (message, args) => {
    const filtered = parseFilter([args[0]]);
    const news = await fetchNews(filtered ? filtered[0] : 'ALL');

    let order;

    if (isValidOrder(args[0], news.length)) {
      order = parseOrder(args[0], news.length);
    } else {
      order = parseOrder(args[1], news.length);
    }

    const embed = new MessageEmbed();

    fetchPage(parseUrl(news[order].href), 30 * 60).then((html) => {
      const summary = getSummary(html);
      embed.addField(
        `${getNewsEmojis(news[order].platforms)}${summary.title}`,
        `${news[order].content} [Read on Tera Website](${parseUrl(news[order].href)})`,
      );
      const newsSummary = summary.topics.map(t => `▫${t}`);
      if (newsSummary.length > 0) {
        embed.addField('Summary', newsSummary);
      }
      embed.setImage(summary.img);
      message.channel.send(embed);
    });
  },
};
