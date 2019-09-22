const { Command } = require('chop-tools');

const log = require('../../config/log');
const Suggestion = require('../../models/suggestion');

module.exports = new Command({
  name: 'suggestion',
  description: 'Send a suggestion to help make Chop better.',
  args: ['suggestion'],
  aliases: ['suggest'],
  category: 'other',
  usage: '{Your Suggestion}',
  cooldown: 120,
  async run(message, args, call) {
    // Validate suggestion
    const suggestion = args.join(' ');

    if (suggestion.length < 3) {
      const msg = await message.channel.send('The suggestion was invalid, please try again.');
      this.client.setTimeout(() => {
        msg.delete();
      }, 3000);
      return;
    }

    const newSuggestion = new Suggestion({
      userId: call.caller,
      tag: call.callerTag,
      suggestion,
      time: new Date(),
    });

    try {
      await newSuggestion.save();
      await message.channel.send('Thank you for making a suggestion!');
      try {
        const count = await Suggestion.estimatedDocumentCount();
        message.channel.send(
          `There are currently **${count}** suggestions in my suggestion box! :D`,
        );
      } catch {
        /* */
      }
    } catch (e) {
      log.error(e);
      message.channel.send('I could not save your suggestion. :(');
    }
  },
});
