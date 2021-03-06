const TeraNewsReader = require('../src/services/tera/TeraNewsReader');

describe('Tera News Service', () => {
  describe('Parse Filter', () => {
    test('should return null if no arguments', () => {
      expect(TeraNewsReader.parsePlatforms()).toEqual(null);
    });

    test('should filter out invalid types', () => {
      const actual = [true, null, undefined, 'iii', 4444, { a: 1 }, ['c']];
      expect(TeraNewsReader.parsePlatforms(actual)).toEqual([]);
    });

    test('should filter invalid filters', () => {
      const actual = ['PC', 'PS4', 'NINTENDO', 'XBOX', 'MOBILE'];
      expect(TeraNewsReader.parsePlatforms(actual)).toEqual(['PC', 'PS4', 'XBOX']);
    });

    test('should upper case valid filters', () => {
      const actual = ['pc', 'ps4', 'xbox'];
      expect(TeraNewsReader.parsePlatforms(actual)).toEqual(['PC', 'PS4', 'XBOX']);
    });

    test('should transform valid aliases', () => {
      const actual = ['windows', 'playstation'];
      const actual2 = ['playstation', 'windows', 'elin'];
      expect(TeraNewsReader.parsePlatforms(actual)).toEqual(['PC', 'PS4']);
      expect(TeraNewsReader.parsePlatforms(actual2)).toEqual(['PS4', 'PC']);
    });

    test('should have no duplicates', () => {
      const actual = [
        'pc',
        'PC',
        'PC',
        'windows',
        'wInDoWs',
        'xbox',
        'playstation',
        'Nintendo Switch',
        'PS4',
        'ps4',
        'Xbox',
        'pc',
      ];
      expect(TeraNewsReader.parsePlatforms(actual)).toEqual(['PC', 'XBOX', 'PS4']);
    });
  });
});
