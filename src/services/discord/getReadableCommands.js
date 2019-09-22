module.exports = (commands) => {
  if (!Array.isArray(commands)) return null;
  return commands
    .filter(c => !c.hidden)
    .map(command => ({
      name: command.name,
      cooldown: command.cooldown,
      description: command.description,
      category: command.category,
      args: command.args,
      aliases: command.aliases,
    }));
};
