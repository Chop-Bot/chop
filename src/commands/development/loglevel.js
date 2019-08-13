const log = require('../../config/log');

module.exports = {
  name: 'loglevel',
  description: 'Set the logging level.',
  hidden: true,
  cooldown: 0,
  execute(message, args) {
    log.setLevel(args[0]);
    log.info('[Log] Logging Level set to', args[0], 'by', message.author.tag);
    message.channel.send('Done!');
  },
};
