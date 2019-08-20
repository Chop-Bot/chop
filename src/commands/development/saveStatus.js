const { Command } = require('chop-tools');

const log = require('../../config/log');
const TeraStatus = require('../../models/teraStatus');
const TeraStatusReader = require('../../services/tera/TeraStatusReader');

module.exports = new Command({
  name: 'savestatus',
  description: 'Saves the current tera status to the database. (For Development)',
  hidden: true,
  run: async (message) => {
    const statuses = await TeraStatusReader.fetchAndRead();
    log.debug('Tera status:', JSON.stringify(statuses));
    const ts = new TeraStatus({
      date: new Date(),
      servers: statuses.reduce((acc, cur) => [...acc, ...cur.servers], []),
    });
    await ts.save();
    message.channel.send('Done!');
  },
});
