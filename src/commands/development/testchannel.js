const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'test-channel',
  description: 'Makes Chop send a message to a specific channel to see if it can.',
  hidden: true,
  async run(message, args) {
    const possibleId = args[0];
    const possibleChannelById = message.guild.channels.get(possibleId);
    const possibleMention = args[0] && args[0].match(/^(?:<#)?(\d{17,19})>?$/);
    const possibleChannelByMention = possibleMention
      ? message.guild.channels.get(possibleMention[1])
      : null;
    if (possibleChannelById) {
      possibleChannelById
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
    } else if (possibleChannelByMention) {
      possibleChannelByMention
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
});
