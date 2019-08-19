const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'guilds',
  description: 'List the guilds the bot is in.',
  hidden: true,
  admin: true,
  run(message, args) {
    this.client.guilds.map(g => message.channel.send(g.name));
  },
});
