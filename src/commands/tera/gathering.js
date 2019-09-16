const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const { GATHERING_MAIN, GATHERING_EXTRAS } = require('../../config/constants');

module.exports = new Command({
  name: 'gathering',
  aliases: ['gather', 'resources'],
  description: 'Tera gathering spots.',
  usage: '[detailed]',
  async run(message, args) {
    const arg0 = args[0] ? args[0].toLowerCase() || null : null;
    const prefix = this.client.options.prefix;
    if (arg0 && ['detail', 'details', 'detailed'].includes(arg0)) {
      const dm = (...msg) => message.author.send(...msg);
      const embed = new MessageEmbed({
        author: { name: 'Gathering Spots', iconURL: message.author.avatarURL() },
        description: 'This is the detailed information regarding gathering.',
        footer: {
          text: 'See something wrong or want to contribute? https://chop.coffee/feedback',
          icon_url: this.client.user.avatarURL(),
        },
      });

      embed.addField(
        '⛏**Ores**',
        'Cobala Ore -> Val Oryn, Arcadia, Ostgarath, Poporia\n'
          + 'Shadmetal Ore -> Westonia, Allemantheia, Val Elenium, Val Palrada\n'
          + 'Xermetal Ore -> Kaiator, Lorcada, Sylvanoth, Essenia\n'
          + 'Normetal Ore -> Veritas, Island of Dawn, Velika, Val Aureum\n'
          + 'Galborne Ore -> Val Tirkai, Helkan, Val Kaeli\n',
      );

      embed.addField(
        '🌿**Plants**',
        'Cobseed -> Sylvanoth, Ostgarath, Poporia\n'
          + 'Veridia Root -> Sylvanoth, Essenia, Arcadia\n'
          + 'Mushroom Cap -> Veritas District, Essenia, Poporia\n'
          + 'Moongourd Pulp -> Val Palrada, Ostgarath, Velika\n'
          + 'Apple -> Veritas District, Val Palrada, Arcadia\n',
      );

      embed.addField(
        '✨**Essences**',
        'Crimson Essence -> Allemantheia, Val Elenium, Val Oryn, Island of Dawn\n'
          + 'Earth Essence -> Val Aureum, Val Oryn, Island of Dawn\n'
          + 'Azure Essence -> Westonia, Kaiator, Lorcada, Val Elenium\n'
          + 'Opal Essence -> Westonia, Allemantheia, Val Oryn, Val Aureum\n'
          + 'Obsidian Essence -> Val Tirkai, Helkan, Val Kaeli\n',
      );

      embed.addField('🖼**Useful Screenshots**', `[🔹 See Images](${GATHERING_EXTRAS})`);

      dm(embed);

      message.channel.send('More detailed gathering info was sent to your DMs.');
      return;
    }

    const embed = new MessageEmbed({
      author: { name: 'Gathering Spots', iconURL: message.author.avatarURL() },
      description: `This is a map of where you can find specific resources, for more detailed info use \`${prefix} gathering detailed\``,
      footer: {
        text: 'See something wrong or want to contribute? https://chop.coffee/feedback',
        icon_url: this.client.user.avatarURL(),
      },
    });
    embed.setImage(GATHERING_MAIN);
    message.channel.send(embed);
  },
});
