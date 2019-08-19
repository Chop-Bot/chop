const { Command } = require('chop-tools');

module.exports = new Command({
  name: 'twitter',
  description: 'Gets the latest tera tweet.',
  aliases: ['tweet'],
  async run(message) {
    try {
      const url = await this.client.twitter.getLatestTeraTweetUrl();
      message.channel.send(url);
    } catch (e) {
      message.channel.send(
        "Oops. I couldn't get the latest tweet. Maybe try again later? :flushed:",
      );
    }
  },
});
