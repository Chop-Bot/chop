const log = require('../../config/log');
const parseUrl = require('../tera-general/parseUrl');
const fetchPage = require('../tera-general/fetchPage');
const getNews = require('./getNews');

async function fetchTeraNews(filter = 'ALL') {
  let route = 'all';
  if (filter === 'ALL') route = 'all';
  if (filter === 'PC') route = 'windows';
  if (filter === 'PS4') route = 'playstation';
  if (filter === 'XBOX') route = 'xbox';

  try {
    const html = await fetchPage(parseUrl(`news/categories/${route}`), 5 * 60);
    const news = getNews(html);
    return news;
  } catch (err) {
    log.error('[Tera/News] Failed to fetch tera news.', err.message);
    throw err;
  }
}

module.exports = fetchTeraNews;
