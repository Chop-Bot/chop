module.exports = class Util {
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static awaitFor(milliseconds) {
    if (Number.isNaN(Number(milliseconds))) return Promise.resolve();
    return new Promise(resolve => setTimeout(resolve, Number(milliseconds)));
  }

  static emojifyNumbers(num) {
    return Number(
      `${Number(num)}`.replace(/\d/g, (match) => {
        if (match === '0') return ':zero:';
        if (match === '1') return ':one:';
        if (match === '2') return ':two:';
        if (match === '3') return ':three:';
        if (match === '4') return ':four:';
        if (match === '5') return ':five:';
        if (match === '6') return ':six:';
        if (match === '7') return ':seven:';
        if (match === '8') return ':eight:';
        if (match === '9') return ':nine:';
        return '';
      }),
    );
  }

  static pickFrom(arr) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }
};
