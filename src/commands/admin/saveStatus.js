const log = require('../../config/log');
const fetchStatus = require('../../services/tera-status/fetchStatus');
const TeraStatus = require('../../models/teraStatus');

module.exports = {
  name: 'savestatus',
  description: 'Saves the current tera status to the database. (For Development)',
  hidden: true,
  execute: async (message) => {
    const statuses = await fetchStatus();
    log.debug('Tera status:', JSON.stringify(statuses));
    const ts = new TeraStatus({
      date: new Date(),
      servers: statuses.reduce((acc, cur) => [...acc, ...cur.servers], []),
    });
    await ts.save();
    message.channel.send('Done!');
  },
};
