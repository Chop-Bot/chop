require('dotenv').config();
const log = require('./config/log');
const bot = require('./bot');
const web = require('./web');
const events = require('./events');

bot();
web();

events.on('kill', () => {
  process.exitCode = 0;
  log.info('[Process] Shutting down.');
});

process.on('SIGTERM', () => events.emit('kill'));
