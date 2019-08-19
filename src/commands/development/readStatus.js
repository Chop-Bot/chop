const { Command } = require('chop-tools');

const log = require('../../config/log');
const TeraStatus = require('../../models/teraStatus');

module.exports = new Command({
  name: 'readstatus',
  description: 'Reads the latest tera status saved in the database. (For Development)',
  hidden: true,
  run: async (message) => {
    const latest = await TeraStatus.getLatest();
    log.debug('Latest status:', latest);
    message.channel.send('Done!');
  },
});
