require('dotenv').config();
const log = require('./config/log');
const bot = require('./bot');
const events = require('./events');

bot();

events.on('kill', () => {
  process.exitCode = 0;
  log.info('[Process] Shutting down.');
});

process.on('SIGTERM', () => events.emit('kill'));
