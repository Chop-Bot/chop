const read = require('util').promisify(require('fs').readFile);
const { join } = require('path');
const log = require('../../config/log');
const getStatus = require('./getStatus');

async function fetchTeraStatus() {
  try {
    const html = await read(join(__dirname, 'fake-sample.html'));
    const statuses = getStatus(html);
    return statuses;
  } catch (err) {
    log.error('[Tera/Status] Failed to fetch tera status.', err.message);
    throw err;
  }
}

module.exports = fetchTeraStatus;
