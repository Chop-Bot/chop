const { prefix } = require('../config/command');
const Task = require('../Task');

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
    this.client.user.setActivity(pick[0], pick[1]);
  }
};
