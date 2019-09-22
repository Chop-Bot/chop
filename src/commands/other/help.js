const { Command } = require('chop-tools');
const { MessageEmbed } = require('discord.js');

const cap = require('../../util/cap');
const { CATEGORY_EMOJIS } = require('../../config/constants');

module.exports = new Command({
  name: 'help',
  description: 'Let me help you!',
  category: 'other',
  runIn: ['text', 'dm'],
  run(message, args) {
    // return help about specific command
    if (args[0]) {
      const search = args[0].toLowerCase();
      const command = message.client.commands.find(
        c => c.name === search || c.aliases.includes(search),
      );
      if (!command || command.hidden) {
        return message.channel.send(`I could not find the ${args[0]} command.`);
      }
      // gather data and send it to same channel
      const embed = new MessageEmbed({
        author: {
          name: command.name.toUpperCase(),
          iconURL: message.author.avatarURL(),
        },
        footer: {
          text: 'See something wrong or want to contribute? https://chop.coffee/feedback',
          icon_url: this.client.user.avatarURL(),
        },
      });
      embed.addField(':blue_book: Description', command.description);
      if (command.aliases.length > 0) {
        embed.addField(
          ':books: Aliases',
          command.aliases.reduce((acc, cur) => `${acc} \`${cur}\``, ''),
        );
      }
      if (command.usage) {
        embed.addField(
          ':book: Usage',
          `\`\`\`${this.client.options.prefix}${command.name} ${command.usage}\`\`\``
            + '```python\n'
            + '# Remove the brackets.\n'
            + '# {} = Required arguments\n'
            + '# [] = Optional arguments.```',
        );
      }
      if (command.example) {
        const commandExampleStart = `${this.client.options.prefix}${command.name} `;
        embed.addField(
          ':ledger: Example',
          Array.isArray(command.example)
            ? command.example.reduce(
              (acc, cur) => `${acc} \`\`\`${commandExampleStart}${cur}\`\`\``,
              '',
            )
            : `\`\`\`${commandExampleStart}${command.example}\`\`\``,
        );
      }
      return message.channel.send(embed);
    }

    // return a list of commands separated by category
    const embed = new MessageEmbed({
      author: { name: 'Chop Help', iconURL: message.author.avatarURL() },
      footer: {
        text: 'See something wrong or want to contribute? https://chop.coffee/feedback',
        icon_url: this.client.user.avatarURL(),
      },
      description:
        'These are the commands available for Chop.\n'
        + 'To learn more about a command use `chop help {command name}`',
    });

    const commandList = {};

    this.client.commands.forEach((c) => {
      commandList[c.category || 'other'] = [...(commandList[c.category || 'other'] || []), c];
    });

    const cats = Object.keys(commandList);
    cats.sort();
    cats.forEach((category) => {
      embed.addField(
        `${CATEGORY_EMOJIS[category] || ':page_facing_up:'} ${cap(category)}`,
        commandList[category]
          .filter(c => !c.hidden)
          .sort((a, b) => a < b)
          .reduce((acc, cur) => `${acc} \`${cur.name}\``, ''),
      );
    });

    return message.channel.send(embed);
  },
});
