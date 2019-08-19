const { Command } = require('chop-tools');

const log = require('../../config/log');

module.exports = new Command({
  name: 'restart',
  description: 'Restart!',
  hidden: true,
  admin: true,
  run(message, args) {
    log.info(`Restart requested by ${message.author.username}`);
    message.author.send('Restarting Chop.').then(() => process.exit());
  },
});
