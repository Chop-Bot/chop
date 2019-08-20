const { Task } = require('chop-tools');

module.exports = class extends Task {
  constructor() {
    super('Change Activity', 'repeat', '*/20 * * * * *');
  }

  async run() {
    const options = [
      ['Anya Sleeping', { type: 'WATCHING' }],
      ['With Anya', { type: 'PLAYING' }],
      [`${this.client.options.prefix}help`, { type: 'LISTENING' }],
    ];
    const pick = options[Math.floor(Math.random() * options.length)];
    try {
      this.client.user.setActivity(pick[0], pick[1]);
    } catch {
      /* First time will throw because bot isn't up yet */
    }
  }
};
