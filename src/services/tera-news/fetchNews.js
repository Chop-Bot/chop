const log = require('../../config/log');
const parseUrl = require('../tera-general/parseUrl');
const fetchPage = require('../tera-general/fetchPage');
const getNews = require('./getNews');

async function fetchTeraNews() {
  try {
    const html = await fetchPage(parseUrl('news/categories/windows'));
    const news = getNews(html);
    return news;
  } catch (err) {
    log.error('[Tera/News] Failed to fetch tera news.', err.message);
    throw err;
  }
}

module.exports = fetchTeraNews;
