const removeNonStrings = v => typeof v === 'string';
const toUpper = v => v.toUpperCase();

const parseFiler = (filter) => {
  if (!filter || !(filter instanceof Array)) {
    return null;
  }
  const filtered = [
    ...new Set(
      filter
        .filter(removeNonStrings)
        .map(toUpper)
        .map((plat, i, arr) => {
          if (['PC', 'PS4', 'XBOX'].includes(plat)) return plat;
          if (plat === 'WINDOWS') return 'PC';
          if (plat === 'PLAYSTATION') return 'PS4';
          if (plat === 'CONSOLE') {
            arr.push('PS4', 'XBOX');
            return null;
          }
          return null;
        })
        .filter(v => !!v),
    ),
  ];
  return filtered;
};

module.exports = parseFiler;
