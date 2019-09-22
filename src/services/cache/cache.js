const util = require('util');

const redis = require('redis');
const slug = require('slug');

const events = require('../../events');
const log = require('../../config/log');
const filesystemCache = require('./filesystemCache');

const CACHE_TYPE = {
  FS: 1,
  REDIS: 2,
};

// TODO: Wrap redis methods with easy to remember names

const cache = {
  client: {},
  type: 0,
  ready: false,
  generateKey(input) {
    if (this.type === CACHE_TYPE.FS) {
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
  cache.type = CACHE_TYPE.FS;
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
  cache.type = CACHE_TYPE.REDIS;
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
    // logError('[Cache] A Redis URI was configured but could not connect to the server.', err);
    log.warn('[Cache] Could not connect to redis. Falling back to FS cache.');
    client.end(true);
    pickFS();
  });
  events.on('kill', () => {
    client.end(true);
  });
}

module.exports = cache;
