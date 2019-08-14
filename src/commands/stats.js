const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'info',
  description: 'Show some stats about Voice.',
  execute(message) {
    const guilds = message.client.guilds.size;
    const users = message.client.users.size;
    const uptime = message.client.uptime;
    const uptimeFormatted = new Date(uptime).toISOString().substr(11, 8);
    const ping = Math.trunc(message.client.ws.ping);

    const embedData = {
      color: 13044507,
      footer: {
        text: `Version ${module.require('../../package.json').version || 'latest'}`,
      },
      thumbnail: {
        url: message.client.user.avatarURL(),
      },
      author: {
        name: 'Chop Stats',
      },
      fields: [
        {
          name: 'Servers',
          value: `${guilds}`,
          inline: true,
        },
        {
          name: 'Users',
          value: `${users}`,
          inline: true,
        },
        {
          name: 'Uptime',
          value: `${uptimeFormatted}`,
          inline: true,
        },
        {
          name: 'Ping',
          value: `${ping}ms`,
          inline: true,
        },
      ],
    };
    const embed = new MessageEmbed(embedData);
    message.channel.send(embed);
  },
};
