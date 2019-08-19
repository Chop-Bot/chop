const { Command } = require('chop-tools');

const log = require('../../config/log');
const TeraTwitter = require('../../models/teraTwitter');

module.exports = new Command({
  name: 'savetweet',
  description: 'Saves the current tera status to the database. (For Development)',
  hidden: true,
  async run(message) {
    try {
      const updatedTwitter = new TeraTwitter({
        date: new Date(),
        latestTweetID: await this.client.twitter.getLatestTeraTweetID(),
      });
      await updatedTwitter.save();
      message.channel.send('Done!');
    } catch (err) {
      log.error(err);
      message.channel.send('Something went wrong.');
    }
  },
});
