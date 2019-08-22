const { Command } = require('chop-tools');

const Util = require('../../util/Util');

module.exports = new Command({
  name: 'pick',
  description: 'Pick something from a set.',
  category: 'other',
  args: ['choice'],
  usage: '[what to pick from]',
  aliases: ['choice'],
  async run(message, args) {
    const result = Util.pickFrom(args);
    let msg = await message.channel.send(
      `:page_facing_up: **| ${
        message.author.username
      }** asked me to pick something.\n:1234: And I pick`,
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
