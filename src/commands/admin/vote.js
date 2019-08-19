const { Command } = require('chop-tools');

const getEmojis = require('discordjs-getemojis');
const irregulars = require('discordjs-getemojis/util/irregulars.json');
const prompter = require('discordjs-prompter');

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

module.exports = new Command({
  name: 'vote',
  description: 'Create a voting based on the emojis on your message. (Admin only)',
  usage: '[time in seconds] <Your message>',
  admin: true,
  run: async (message, args) => {
    const emojis = getEmojis(message).map(e => getKeyByValue(irregulars, e) || e);
    let timeout = Number.isNaN(Number(args[0])) ? 30000 : Math.trunc(Number(args[0]) * 1000);
    if (timeout / 1000 < 5) timeout = 30000;
    const { channel, content } = message;
    let index;
    if (Number.isNaN(Number(args[0]))) {
      index = content.indexOf(` ${args[0]}`);
    } else {
      index = content.indexOf(` ${args[1]}`);
    }
    const question = `${content.slice(index)}\n\nInitiated by: ${message.author}`;
    await message.delete();
    if (emojis.length > 0) {
      const votes = await prompter.vote(channel, {
        choices: emojis,
        question,
        timeout,
      });
      const winner = votes.emojis[0].count > (votes.emojis[1] ? votes.emojis[1].count : 0)
        ? votes.emojis[0]
        : null;
      if (winner) {
        channel.send(
          `${winner.emoji} wins with **${(winner.count / votes.total) * 100}%** of the votes!`,
        );
      }
      channel.send(
        `**Results:**\n ${votes.emojis.reduce(
          (acc, cur) => `${acc + cur.emoji} -> ${(cur.count / votes.total) * 100}%\n`,
          '',
        )}`,
      );
    } else {
      channel.send("I couldn't find any emojis in your message.");
    }
  },
});
