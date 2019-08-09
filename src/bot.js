const path = require('path');

const Discord = require('discord.js');
const Command = require('discordjs-command');

const log = require('./config/log');
const logError = require('./util/logError');
const commandConfig = require('./config/command');
const events = require('./events');

module.exports = function bot() {
  const client = new Discord.Client();

  client.on('ready', () => {
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

  client.login(process.env.TOKEN);
};
