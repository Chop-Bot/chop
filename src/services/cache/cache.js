/* eslint dot-notation: "off" */
const util = require('util');
const path = require('path');

const redis = require('redis');
const slug = require('slug');

const log = require('../../config/log');
const filesystemCache = require('./filesystemCache');

const CACHE_TYPE = {
  fs: 1,
  redis: 2,
};

const cache = {
  client: {},
  type: 0,
  ready: false,
  generateKey(input) {
    if (this.type === CACHE_TYPE.fs) {
      return `${slug(input)}.html`;
    }
    return slug(input);
  },
  CACHE_TYPE,
};

const REDIS_URI = process.env.REDIS_URI;
let client;

function pickFS() {
  cache.client = filesystemCache.createClient();
  cache.type = CACHE_TYPE['fs'];
  cache.ready = true;
  log.info('[Cache] FS is ready.');
}

function pickRedis(redisClient) {
  // TODO: Refactor this
  const promises = {
    get: util.promisify(redisClient.get),
    set: util.promisify(redisClient.set),
    del: util.promisify(redisClient.del),
    flushall: util.promisify(redisClient.flushall),
  };
  cache.client = Object.assign(redisClient, promises);
  cache.type = CACHE_TYPE['redis'];
  cache.ready = true;
  log.info('[Cache] Redis is ready.');
}

if (!REDIS_URI) {
  pickFS();
} else {
  client = redis.createClient(REDIS_URI);
  client.on('ready', () => {
    client.flushall();
    pickRedis(client);
  });
  client.on('error', (err) => {
    log.error('[Cache] A Redis URI was configured but could not connect to the server.');
    log.error(err.message);
    log.error(err.stack);
    log.info('[Cache] Falling back to FS cache.');
    client.end(true);
    pickFS();
  });
}

module.exports = cache;
