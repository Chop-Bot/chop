const log = require('../../config/log');

module.exports = {
  name: 'test-channel',
  description: 'Makes Chop send a message to a specific channel to see if it can.',
  hidden: true,
  async execute(message, args) {
    const possibleId = args[0];
    const possibleChannel = message.guild.channels.get(possibleId);
    if (possibleChannel) {
      possibleChannel
        .send('Beep')
        .then((msg) => {
          setTimeout(
            () => msg
              .delete()
              .then(
                () => message.channel.send('Success!'),
                () => message.channel.send('Oof, could not delete. :('),
              ),
            3000,
          );
        })
        .catch(() => message.channel.send('Oof, could not send. :('));
    } else {
      message.channel.send('Could not find that channel');
    }
  },
};
