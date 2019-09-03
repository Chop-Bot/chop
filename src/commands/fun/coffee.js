const { Command } = require('chop-tools');
const moment = require('moment');

const Profile = require('../../models/profile');

const timeToNextCoffe = (lastCoffee) => {
  // eslint-disable-next-line new-cap
  const now = new moment();
  const lastUsed = moment(lastCoffee);
  const diff = now.diff(lastUsed);
  const d24 = moment.duration(3, 'h');
  return d24 - diff;
};

const format = time => moment.duration(time).format('HH[H] mm[M] ss[S]');

module.exports = new Command({
  name: 'coffee',
  description: 'Give coffee to someone!',
  category: 'fun',
  aliases: ['rep'],
  usage: '[@mention]',
  async run(message, args, call) {
    const mention = message.mentions.members.first();
    const next = timeToNextCoffe(call.profile.coffee.time);
    if (!mention || (mention && mention.user.id === call.caller)) {
      message.channel.send(
        `<a:coffeeyum:612761306608697346> **| ${message.author.username}**! You have received **${
          call.profile.coffee.count
        }** coffees so far! Yeah! \\:D`,
      );
      if (next <= 0) {
        message.channel.send(':timer: **|** You have **1** coffee to send!');
      } else {
        message.channel.send(`:timer: **|** Your next coffee is in **${format(next)}**`);
      }
      return;
    }

    // give coffee
    if (next <= 0) {
      message.channel.send(
        `<a:coffeeyum:612761306608697346> **| ${mention.user.username}**! You got a coffee from **${
          message.author.username
        }**! *sip sip sip* c:<`,
      );
      call.profile.coffee.time = new Date();
      await call.profile.save();
      await Profile.getOrCreate(mention.user.id);
      await Profile.findOneAndUpdate({ userId: mention.user.id }, { $inc: { 'coffee.count': 1 } });
    } else {
      message.channel.send(
        `:timer: **|** Oh no **${message.author.username}** you have to wait **${format(next)}**`,
      );
    }
  },
});
