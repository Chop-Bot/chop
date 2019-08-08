const request = require('request-promise-native');

const log = require('../../config/log');

async function fetchTeraPage(url) {
  let html;
  try {
    html = await request(url);
    return html;
  } catch (e) {
    log.error('Failed to fetch page:', url);
    throw e;
  }
}

module.exports = fetchTeraPage;
