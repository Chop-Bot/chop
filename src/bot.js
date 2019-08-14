const path = require('path');

const Discord = require('discord.js');
const Command = require('discordjs-command');

const log = require('./config/log');
const logError = require('./util/logError');
const commandConfig = require('./config/command');
const events = require('./events');
const startSchedule = require('./Schedule');
const TwitterClient = require('./services/twitter/TwitterClient');

module.exports = function bot() {
  const client = new Discord.Client();

  Object.defineProperty(client, 'twitter', { value: new TwitterClient(), writable: false });

  client.on('ready', () => {
    startSchedule(client);
    log.info(`[Discord] It's coffee time! [${client.user.tag}]`);
  });

  client.on('error', (err) => {
    logError('[Discord] A discord error happened.', err);
  });

  const commands = new Command(client, commandConfig, path.join(__dirname, 'commands'));

  commands.ListenForCommands((cmds) => {
    log.info(`[Commands] ${cmds.size} commands loaded.`);
  });

  events.on('kill', () => client.destroy());

  client
    .login(process.env.TOKEN)
    .then(() => log.info('[Discord] Log in successful.'))
    .catch((err) => {
      logError('[Discord] Could not login to Discord. Exiting...', err, true);
      process.exit(1);
    });
};
