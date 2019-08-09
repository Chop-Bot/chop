const fs = require('fs');
const path = require('path');
const util = require('util');

const exists = util.promisify(fs.exists);
const read = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const remove = util.promisify(fs.unlink);
const removeDir = util.promisify(fs.rmdir);

const tmp = require('tmp');
const slug = require('slug');

const log = require('../../config/log');
const events = require('../../events');

let dir;

function getDir() {
  if (!dir) {
    dir = tmp.dirSync({ prefix: 'chop-' }).name;
  }
  return dir;
}

const expireTimeouts = new Map();

function scheduleNewExpirationTime(file, seconds) {
  const timeout = setTimeout(() => {
    expireTimeouts.delete(file);
    remove(file);
  }, seconds * 1000);
  expireTimeouts.set(file, timeout);
}

function clearAllTimeouts() {
  expireTimeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
  expireTimeouts.clear();
}

function get(key) {
  return new Promise((resolve, reject) => {
    const file = path.join(dir, key);
    exists(file)
      .then((fileExists) => {
        if (!fileExists) {
          resolve(null);
        }
        return read(file, 'utf8');
      })
      .then(resolve)
      .catch(reject);
  });
}

// mode here is for consistency with redis
function set(key, data, mode, expire) {
  const file = path.join(dir, key);
  return new Promise((resolve, reject) => {
    if (!key) reject(new Error('Missing key'));
    if (!data) reject(new Error('Missing data'));
    if (expire && typeof expire !== 'number') reject(new Error('Expire time must be a number'));
    log.debug('[Cache/FS] Caching:', file);
    write(file, data, 'utf8')
      .then(() => scheduleNewExpirationTime(file, expire || 1 * 60 * 60))
      .catch(reject);
  });
}

function del(key) {
  return new Promise((resolve, reject) => {
    exists(key)
      .then((fileExists) => {
        if (!fileExists) {
          resolve();
          return;
        }
        remove(key).then(() => {
          if (expireTimeouts.has(key)) {
            clearTimeout(expireTimeouts.get(key));
            expireTimeouts.delete(key);
          }
        });
      })
      .catch(reject);
  });
}

function flushAll() {
  removeDir(dir).then(fs.mkdirSync(dir));
  clearAllTimeouts();
}

events.on('kill', () => {
  clearAllTimeouts();
});

exports.getDir = getDir;
exports.createClient = () => {
  getDir();
  return {
    get,
    set,
    del,
    flushAll,
  };
};
