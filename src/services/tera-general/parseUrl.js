const url = require('url');

function parseTeraUrl(path) {
  const baseUrl = 'http://tera.enmasse.com';
  let targetUrl;
  if (path) {
    targetUrl = url.resolve(baseUrl, path);
  } else {
    targetUrl = baseUrl;
  }
  return targetUrl;
}

module.exports = parseTeraUrl;
