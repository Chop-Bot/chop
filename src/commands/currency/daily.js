const { Command } = require('chop-tools');
const moment = require('moment');

const { BEAN_EMOJI } = require('../../config/constants');

const timeUntilTomorrow = () => new moment()
  .add(1, 'day')
  .startOf('day')
  .diff(new moment());

const timeToNextDaily = (lastDaily) => {
  const lastUsed = new moment(lastDaily);
  const now = new moment();
  if (lastUsed.isBefore(now, 'day')) {
    return 0;
  }
  return timeUntilTomorrow();
};

const format = time => moment.duration(time).format('HH[H] mm[M] ss[S]');

module.exports = new Command({
  name: 'daily',
  description: 'Get your daily coffee beans!',
  category: 'currency',
  aliases: ['day'],
  async run(message, args, call) {
    const next = timeToNextDaily(call.profile.daily.time);
    if (next <= 0) {
      const amount = Math.min(300 + call.profile.daily.count * 50, 2000);
      message.channel.send(
        `<a:coffeeyum:612761306608697346> **| ${message.author.username}**! Here is your daily coffee beans! :D\n`
          + `:moneybag: **| ${amount}**${BEAN_EMOJI}\n`
          + `       **|** Your next daily is in ${format(timeUntilTomorrow())}`,
      );
      call.profile.daily.time = new Date();
      call.profile.daily.count += 1;
      call.profile.money += amount;
      await call.profile.save();
    } else {
      message.channel.send(
        `:timer: **|** Oh no **${message.author.username}** you have to wait **${format(next)}**`,
      );
    }
  },
});
