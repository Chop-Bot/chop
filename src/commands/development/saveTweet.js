const log = require('../../config/log');
const fetchStatus = require('../../services/tera-status/fetchStatus');
const TeraTwitter = require('../../models/teraTwitter');

module.exports = {
  name: 'savetweet',
  description: 'Saves the current tera status to the database. (For Development)',
  hidden: true,
  execute: async (message) => {
    try {
      const updatedTwitter = new TeraTwitter({
        date: new Date(),
        latestTweetID: await message.client.twitter.getLatestTeraTweetID(),
      });
      await updatedTwitter.save();
      message.channel.send('Done!');
    } catch (err) {
      log.error(err);
      message.channel.send('Something went wrong.');
    }
  },
};
