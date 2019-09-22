const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const TeraNewsReader = require('../../services/tera/TeraNewsReader');
const TeraHelper = require('../../services/tera/TeraHelper');

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

module.exports = new Command({
  name: 'read',
  description: 'Reads the summary of a tera news post.',
  category: 'tera',
  usage: '[order|platform] [order]',
  example: 'pc 2',
  cooldown: 5,
  run: async (message, args) => {
    const filtered = TeraNewsReader.parsePlatforms([args[0]]);
    const news = await TeraNewsReader.fetchAndRead(filtered ? filtered[0] : 'ALL');

    let order;

    if (isValidOrder(args[0], news.length)) {
      order = parseOrder(args[0], news.length);
    } else {
      order = parseOrder(args[1], news.length);
    }

    const embed = new MessageEmbed();

    TeraHelper.fetchPage(TeraHelper.parseUrl(news[order].href), 30 * 60).then((html) => {
      const summary = TeraNewsReader.crawlSummary(html);
      embed.addField(
        `${TeraNewsReader.getEmojis(news[order].platforms)}${summary.title}`,
        `${news[order].content} [Read on Tera Website](${TeraHelper.parseUrl(news[order].href)})`,
      );
      const newsSummary = summary.topics.map(t => `▫${t}`);
      if (newsSummary.length > 0) {
        embed.addField('Summary', newsSummary);
      }
      embed.setImage(summary.img);
      message.channel.send({ embed });
    });
  },
});
