const events = require('../../events');

module.exports = {
  name: 'kill',
  description: 'Kill!',
  hidden: true,
  admin: true,
  execute(message, args) {
    console.log(`Kill requested by ${message.author.username}`);
    message.author.send('Goodbye.').then(() => {
      events.emit('kill');
    });
  },
};
