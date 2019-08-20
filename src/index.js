require('./config/environment');
const log = require('./config/log');
const logError = require('./util/logError');
const db = require('./services/database/db');
const cache = require('./services/cache/cache');
const events = require('./events');
const bot = require('./bot');
const web = require('./web');

db((mongo) => {
  log.info('[Database] MongoDB Connected.');
  try {
    bot();
    web();
  } catch (err) {
    logError('[Index] Unhandled promise caught. Restarting.', err, true);
    process.exit(1);
  }
});

events.on('kill', () => {
  process.exitCode = 0;
  log.info('[Process] Shutting down.');
});

process.on('SIGTERM', () => events.emit('kill'));
process.on('SIGINT', () => events.emit('kill'));
process.on('uncaughtException', (err, origin) => {
  log.getLogger('critical').error('Uncaught Exception!', err, 'Origin:', origin);
});
