const { Command } = require('chop-tools');

const Currency = require('../../services/chop/curency');
const { BEAN_EMOJI } = require('../../config/constants');

module.exports = new Command({
  name: 'balance',
  description: 'Tells you how much coffee beans you have.',
  category: 'currency',
  aliases: ['bal', 'money', 'currency'],
  async run(message, args, call) {
    if (args[0] && call.isSuperUser) {
      const bal = await Currency.getBalance(args[0]);
      if (bal) {
        const msg = await message.channel.send(`That user's balance is **${bal}**${BEAN_EMOJI}`);
        this.client.setTimeout(() => {
          msg.delete();
          message.delete();
        }, 3000);
      } else {
        console.log('no balance', bal);
      }
      return;
    }

    message.channel.send(
      `Hello ${message.author.username}. \nYou currently have **${call.profile.money}**${BEAN_EMOJI}.`,
    );
  },
});
