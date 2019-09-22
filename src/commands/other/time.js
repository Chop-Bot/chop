const moment = require('moment');

/*
var jun = moment("2014-06-01T12:00:00Z");
var dec = moment("2014-12-01T12:00:00Z");

jun.tz('America/Los_Angeles').format('ha z');  // 5am PDT
dec.tz('America/Los_Angeles').format('ha z');  // 4am PST

jun.tz('America/New_York').format('ha z');     // 8am EDT
dec.tz('America/New_York').format('ha z');     // 7am EST

jun.tz('Asia/Tokyo').format('ha z');           // 9pm JST
dec.tz('Asia/Tokyo').format('ha z');           // 9pm JST

jun.tz('Australia/Sydney').format('ha z');     // 10pm EST
dec.tz('Australia/Sydney').format('ha z');     // 11pm EST
*/

const { Command } = require('chop-tools');

// const Util = require('../../util/Util');

module.exports = new Command({
  name: 'time',
  description: 'TBD',
  category: 'other',
  usage: '[timezone]',
  hidden: true,
  aliases: ['hour', 'clock'],
  async run(message, args, call) {
    // TBD
  },
});
