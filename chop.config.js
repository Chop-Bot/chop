const production = process.env.NODE_ENV === 'production';

module.exports = {
  prefix: production ? 'chop ' : 'chopdev ',
  owners: ['517599684961894400'],
  bestMatch: true,
  showNotFoundMessage: true,
};
