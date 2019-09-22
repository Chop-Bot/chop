const { Command } = require('chop-tools');

const Currency = require('../../services/chop/curency');
const { BEAN_EMOJI } = require('../../config/constants');
const logError = require('../../util/logError');

module.exports = new Command({
  name: 'pay',
  description: 'Pays someone the specified amount of coffee beans.',
  category: 'currency',
  usage: '{@mention} {amount}',
  args: ['mention', 'amount'],
  example: '@Lar 200',
  async run(message, args, call) {
    const userMention = message.mentions.users.first();
    const amount = Math.floor(Number(args[1]));
    if (!userMention) {
      const msg = await message.channel.send("You didn't tag someone to pay.");
      this.client.setTimeout(() => {
        msg.delete();
      }, 3000);
      return;
    }

    if (Number.isNaN(amount)) {
      const msg = await message.channel.send('That amount is not a valid number!');
      this.client.setTimeout(() => {
        msg.delete();
      }, 3000);
      return;
    }

    try {
      const [bal] = await Currency.transfer(call.caller, userMention.id, amount);
      message.channel.send(
        `**${message.author.username}**, you sent **${amount}**${BEAN_EMOJI} to **${userMention.username}**.\n`
          + `Your new balance is **${bal}**`,
      );
    } catch (err) {
      logError(
        `Failed to transfer ${amount} currency from ${call.callerTag} to ${userMention.tag}`,
        err,
      );
    }
  },
});
