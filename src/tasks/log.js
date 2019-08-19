const { Task } = require('chop-tools');

const filesize = require('filesize');

const log = require('../config/log');

module.exports = class extends Task {
  constructor() {
    super('Log', 'repeat', '*/20 * * * *');
  }

  async run() {
    const memory = filesize(process.memoryUsage().rss);
    // FIXME: At midnight, 23 goes to 00.
    const uptime = new Date(this.client.uptime).toISOString().substr(11, 8);
    log.info(`[Task/Log] Memory Usage: ${memory} | Uptime: ${uptime}`);
  }
};
