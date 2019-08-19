const { Command } = require('chop-tools');

const log = require('../../config/log');

module.exports = new Command({
  name: 'emotes',
  description: 'List the guilds the bot is in.',
  hidden: true,
  admin: true,
  run(message, args) {
    const emotes = message.guild.emojis.reduce(
      (acc, cur) => [...acc, { name: cur.name, id: cur.id }],
      [],
    );
    log.info(emotes);
    message.channel.send(emotes.reduce((acc, cur) => [...acc, `<a:${cur.name}:${cur.id}>`], []));
    message.channel.send('<a:coffeeyum:612761306608697346> hey there \\*pat pat\\*');
    message.guild.emojis.forEach(e => message.channel.send(e.toString()));
  },
});
