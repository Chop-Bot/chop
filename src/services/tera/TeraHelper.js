const url = require('url');

const request = require('request-promise-native');

const log = require('../../config/log');
const cache = require('../cache/cache');

class TeraHelper {
  constructor() {
    throw new Error('TeraHelper cannot be instantiated.');
  }

  async fetchPage(pageUrl, cacheTime = 0, ignoreCached = false) {
    let html;
    try {
      const key = cache.generateKey(pageUrl);
      if (!ignoreCached) {
        const cachedData = await cache.client.get(key);
        if (cachedData) {
          log.debug('[Tera/FetchPage] Returning cached data.', key);
          return cachedData;
        }
      }
      html = await request(pageUrl);
      if (typeof cacheTime === 'number') {
        if (cacheTime > 0) {
          cache.client.set(cache.generateKey(pageUrl), html, 'EX', cacheTime);
        } else {
          cache.client.set(cache.generateKey(pageUrl), html);
        }
      }
      return html;
    } catch (e) {
      log.error('Failed to fetch page:', pageUrl);
      throw e;
    }
  }

  parseUrl(path) {
    const baseUrl = 'http://tera.enmasse.com';
    let targetUrl;
    if (path) {
      targetUrl = url.resolve(baseUrl, path);
    } else {
      targetUrl = baseUrl;
    }
    return targetUrl;
  }
}

module.exports = TeraHelper;
