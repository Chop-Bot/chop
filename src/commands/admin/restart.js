module.exports = {
  name: 'restart',
  description: 'Restart!',
  hidden: true,
  admin: true,
  execute(message, args) {
    console.log(`Restart requested by ${message.author.username}`);
    message.author.send('Restarting Voice.').then(() => process.exit());
  },
};
