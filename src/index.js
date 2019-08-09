require('./config/environment');
const log = require('./config/log');
const db = require('./services/database/db');
const cache = require('./services/cache/cache');
const events = require('./events');
const bot = require('./bot');
const web = require('./web');

db((mongo) => {
  log.info('[Database] MongoDB Connected.');
  bot();
  web();
});

events.on('kill', () => {
  process.exitCode = 0;
  log.info('[Process] Shutting down.');
});

process.on('SIGTERM', () => events.emit('kill'));
