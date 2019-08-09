const production = process.env.NODE_ENV === 'production';

module.exports = {
  prefix: production ? 'chop ' : 'chopdev ',
  superUser: ['517599684961894400'],
  showCommandNotFoundMessage: false,
  directMessageCommands: 'ignore',
  dmHelp: true,
  typescript: false,
};
