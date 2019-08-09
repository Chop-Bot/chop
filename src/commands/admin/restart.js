const log = require('../../config/log');

module.exports = {
  name: 'restart',
  description: 'Restart!',
  hidden: true,
  admin: true,
  execute(message, args) {
    log.info(`Restart requested by ${message.author.username}`);
    message.author.send('Restarting Chop.').then(() => process.exit());
  },
};
