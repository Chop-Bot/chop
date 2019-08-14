module.exports = str => str
  .split(' ')
  .map(s => s[0].toUpperCase() + s.substr(1))
  .join(' ');
