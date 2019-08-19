const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'ping',
  description: 'Ping!',
  run(message, args) {
    message.channel.send('Pong.');
  },
});
