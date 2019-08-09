const log = require('../../config/log');
const parseUrl = require('../tera-general/parseUrl');
const fetchPage = require('../tera-general/fetchPage');
const getStatus = require('./getStatus');

async function fetchTeraStatus() {
  try {
    const html = await fetchPage(parseUrl('support/server-status'), false, true);
    const statuses = getStatus(html);
    return statuses;
  } catch (err) {
    log.error('[Tera/Status] Failed to fetch tera status.', err.message);
    throw err;
  }
}

module.exports = fetchTeraStatus;
