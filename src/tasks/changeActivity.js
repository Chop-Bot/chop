const { Task } = require('chop-tools');
const { prefix } = require('../config/command');

const logError = require('../util/logError');

module.exports = class extends Task {
  constructor() {
    super('Change Activity', 'repeat', '*/20 * * * * *');
  }

  async run() {
    const options = [
      ['Anya Sleeping', { type: 'WATCHING' }],
      ['With Anya', { type: 'PLAYING' }],
      [`${prefix}help`, { type: 'LISTENING' }],
    ];
    const pick = options[Math.floor(Math.random() * options.length)];
    try {
      this.client.user.setActivity(pick[0], pick[1]);
    } catch (err) {
      logError('[Task/Activity] Could not change activity.', err);
    }
  }
};
