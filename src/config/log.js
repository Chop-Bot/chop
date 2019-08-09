/* eslint no-shadow: "off" */

// Logger Config
const log = require('loglevel');
const chalk = require('chalk');
const prefix = require('loglevel-plugin-prefix');

if (process.env.NODE_ENV === 'development') {
  log.setLevel('debug');
} else {
  log.setLevel('info');
}

prefix.reg(log);

prefix.apply(log, {
  format(level, _, timestamp) {
    const colors = {
      TRACE: chalk.magenta,
      DEBUG: chalk.cyan,
      INFO: chalk.blue,
      WARN: chalk.yellow,
      ERROR: chalk.red,
    };
    return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](level)}`;
  },
});

prefix.apply(log.getLogger('critical'), {
  format(level, name, timestamp) {
    return chalk.red.bold(`[${timestamp}] ${level} ${name}:`);
  },
});

log.info(
  '[Log] Logging level set to',
  `${['Trace', 'Debug', 'Info', 'Warn', 'Error', 'Silent'][log.getLevel()]}.`,
);

module.exports = log;
