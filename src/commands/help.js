const { Command } = require('chop-tools');

const { prefix, dmHelp } = require('../config/command');

module.exports = new Command({
  name: 'help',
  description: 'Let me help you!',
  run: (message, args) => {
    if (args[0]) {
      if (message.client.commands.has(args[0])) {
        const data = [];
        const command = message.client.commands.get(args[0]);

        if (command.admin) {
          return message.channel.send(`I could not find the ${args[0]} command.`);
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) {
          data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        }
        if (command.description) {
          data.push(`**Description:** ${command.description}`);
        }
        if (command.usage) {
          data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
      } else {
        return message.channel.send(`I could not find the ${args[0]} command.`);
      }
    }

    // If no args
    const data = [];
    data.push('🍵 __Here is a list of my commands:__ ☕');
    // eslint-disable-next-line no-restricted-syntax
    for (const command of message.client.commands) {
      const isAdmin = message.member.hasPermission('ADMINISTRATOR', false, true, true);
      // command is an array ['command name', commandObject]
      if (!(command[1].hidden || (command[1].hidden && !isAdmin))) {
        data.push(`**${prefix}${command[1].name}:** ${command[1].description}`);
      }
    }
    data.push(`You can use \`${prefix}help [command name]\` to know more about a command.`);

    if (dmHelp) {
      message.author
        .send(data, { split: true })
        .then(message.channel.send("I DM'd you my commands."));
      return null;
    }
    return message.channel.send(data, { split: true });
  },
});
