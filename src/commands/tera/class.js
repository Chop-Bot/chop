const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const { DISCORD_SERVERS } = require('../../config/constants');

module.exports = new Command({
  name: 'class',
  aliases: ['classes', 'discords'],
  description: 'Shows a list of Tera Classes discord servers.',
  async run(message, args) {
    const embed = new MessageEmbed({
      author: { name: 'Join a Class Discord Server', iconURL: message.author.avatarURL() },
      description:
        'Do you want to learn how to get better at your class? Join a class discord server and learn how!',
      footer: {
        text: 'See something wrong or want your server in this list? https://chop.coffee/feedback',
        icon_url: this.client.user.avatarURL(),
      },
    });

    Object.keys(DISCORD_SERVERS).forEach((className) => {
      embed.addField(
        DISCORD_SERVERS[className].emoji + className,
        `[🔹Join](${DISCORD_SERVERS[className].link})`,
        true,
      );
    });
    message.channel.send(embed);
  },
});
