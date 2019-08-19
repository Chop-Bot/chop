const { Command } = require('chop-tools');
const moment = require('moment');

const log = require('../../config/log');
const Profile = require('../../models/profile');

module.exports = new Command({
  name: 'coffee',
  description: 'Give coffee to someone!',
  category: 'fun',
  aliases: ['rep'],
  usage: '[@mention]',
  async run(message, args, call) {
    const mention = message.mentions.members.first();
    if (!mention || (mention && mention.user.id === call.caller)) {
      message.channel.send(
        `<a:coffeeyum:612761306608697346> **| ${message.author.username}**! you currently have **${
          call.profile.coffee.count
        }** coffees! Yeah! \\:D **`,
      );
      return;
    }
    // give coffee
    // eslint-disable-next-line new-cap
    const now = new moment();
    const lastUsed = moment(call.profile.coffee.time);
    const diff = now.diff(lastUsed);
    const d24 = moment.duration(24, 'h');

    if (d24 - diff <= 0) {
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
        `:timer: **|** Oh no **${message.author.username}** you have to wait **${moment
          .duration(d24 - diff)
          .format('HH[H] mm[M] ss[S]')}**`,
      );
    }
  },
});
