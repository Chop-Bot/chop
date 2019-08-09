const parseFilter = require('./parseFilter');

const getNewsEmojis = (platforms) => {
  const emojis = {
    PC: '<:windows:609381699243081757>',
    PS4: '<:ps4:609381770546118656>',
    XBOX: '<:xbox:609381736899543060>',
  };
  const newsEmojis = parseFilter(platforms).reduce((acc, cur) => acc + emojis[cur], '');
  return newsEmojis;
};

module.exports = getNewsEmojis;
