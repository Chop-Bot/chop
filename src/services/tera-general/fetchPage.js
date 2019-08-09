const request = require('request-promise-native');

const log = require('../../config/log');
const cache = require('../cache/cache');

// TODO: cache the result of this with the new cache system
async function fetchTeraPage(url, keepCache = true, ignoreCache = false) {
  let html;
  try {
    const key = cache.generateKey(url);
    const cachedData = await cache.client.get(key);
    if (cachedData && !ignoreCache) {
      log.debug('[Tera/FetchPage] Returning cached data.', key);
      return cachedData;
    }
    html = await request(url);
    if (keepCache) {
      cache.client.set(cache.generateKey(url), html);
    }
    return html;
  } catch (e) {
    log.error('Failed to fetch page:', url);
    throw e;
  }
}

module.exports = fetchTeraPage;
