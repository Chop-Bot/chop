module.exports = {
  name: 'twitter',
  description: 'Gets the latest tera tweet.',
  aliases: ['tweet'],
  async execute(message) {
    const { client } = message;
    try {
      const url = await client.twitter.getLatestTeraTweetUrl();
      message.channel.send(url);
    } catch (e) {
      message.channel.send(
        "Oops. I couldn't get the latest tweet. Maybe try again later? :flushed:",
      );
    }
  },
};
