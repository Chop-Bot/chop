const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const log = require('../../config/log');

const TeraStatusReader = require('../../services/tera/TeraStatusReader');

const addFields = (embed, statuses) => {
  statuses.forEach((currentStatus) => {
    currentStatus.servers.forEach((server) => {
      embed.addField(
        `${server.name}(${currentStatus.platform})`,
        server.status ? '💚UP' : '💔DOWN',
        true,
      );
    });
  });
  return Promise.resolve();
};

module.exports = new Command({
  name: 'status',
  description: 'Check wether the tera servers are online.',
  usage: '[platform|region] [platform|region]',
  run(message) {
    const embed = new MessageEmbed().setColor(3447003).setDescription('Tera Server Status (NA)');
    const start = Date.now();
    log.info('[Tera/Status] Probing...');

    // TODO: Add a filter for pc, ps4 and xbox
    TeraStatusReader.fetchAndRead()
      .then(statuses => addFields(embed, statuses))
      .then(() => {
        log.info('[Tera/Status] Finished. Took', Date.now() - start, 'ms');
        message.channel.send({ embed });
      })
      .catch(log.error);
  },
});
