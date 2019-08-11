const { MessageEmbed } = require('discord.js');

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
};

module.exports = function buildEmbed(statuses) {
  const embed = new MessageEmbed().setColor(3447003).setDescription('Tera Server Status (NA)');
  addFields(embed, statuses);
  return embed;
};
