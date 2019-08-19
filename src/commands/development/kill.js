const { Command } = require('chop-tools');

const events = require('../../events');
const log = require('../../config/log');

// TODO: Not enough to kill chop
module.exports = new Command({
  name: 'kill',
  description: 'Kill!',
  hidden: true,
  admin: true,
  run(message, args) {
    log.warn(`Kill requested by ${message.author.username}`);
    message.author.send('Goodbye.').then(() => {
      events.emit('kill');
    });
  },
});
