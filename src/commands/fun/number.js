const { Command } = require('chop-tools');

const Util = require('../../util/Util');

module.exports = new Command({
  name: 'number',
  description: 'Gives you a random number',
  category: 'fun',
  usage: '[min|max] [max]',
  aliases: ['num', 'random'],
  async run(message, args, call) {
    let first = Math.round(Number(args[0]));
    let second = Math.round(Number(args[1]));
    if (Number.isNaN(first) || first > 1000000 || first < -1000000) first = 1;
    if (Number.isNaN(second) || second > 1000000 || second < -1000000) second = first + 100;
    const [min, max] = [Math.min(first, second), Math.max(first, second)];
    const result = Util.randomInt(min, max);
    let msg = await message.channel.send(
      `:page_facing_up: **| ${
        message.author.username
      }** asks for a random number between **${first}** and **${second}**\n:1234: Your random number is`,
    );
    await Util.awaitFor(200);
    msg = await msg.edit(`${msg.content}.`);
    await Util.awaitFor(200);
    msg = await msg.edit(`${msg.content}.`);
    await Util.awaitFor(200);
    msg = await msg.edit(`${msg.content}.`);
    await Util.awaitFor(200);
    msg = await msg.edit(`${msg.content} **${result}**!!!`);
  },
});
