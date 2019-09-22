const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const log = require('../../config/log');

const TeraNewsReader = require('../../services/tera/TeraNewsReader');
const TeraHelper = require('../../services/tera/TeraHelper');

module.exports = new Command({
  name: 'news',
  description: 'Fetch the latest tera news.',
  category: 'tera',
  usage: '[filter]',
  example: 'pc',
  run: async (message, args) => {
    const start = Date.now();
    log.debug('[Tera/News] Fetching news...');

    const filtered = TeraNewsReader.parsePlatforms([args[0]]);
    const news = await TeraNewsReader.fetchAndRead(filtered ? filtered[0] : 'ALL');

    const embed = new MessageEmbed();

    embed.setDescription('**Latest Tera News (NA)**');

    news.forEach((n) => {
      embed.addField(
        `${TeraNewsReader.getEmojis(n.platforms)} ${n.title}`,
        `${n.content}\n[:small_blue_diamond:Read More](${TeraHelper.parseUrl(n.href)})\n`,
      );
    });

    log.debug('[Tera/News] Done! Finished in', Date.now() - start, 'ms');

    message.channel.send({ embed });
  },
});
