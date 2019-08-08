const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const cheerio = require('cheerio');

const log = require('../../config/log');
const parseUrl = require('../../services/tera-general/parseUrl');
const extractNews = require('../../services/tera-news/getNews');
const fetchPage = require('../../services/tera-general/fetchPage');
const getSummary = require('../../services/tera-news/getSummary');

module.exports = {
  name: 'read',
  description: 'Reads the saved file.',
  hidden: true,
  execute: async (message, args) => {
    const filename = 'news.html';
    const newsHtml = await readFile(path.join(__dirname, filename), 'utf8');
    const news = extractNews(newsHtml);

    // read latest post
    fetchPage(parseUrl(news[0].href)).then((html) => {
      const summary = getSummary(html);
      log.info('Title:', summary.title);
      log.info(`Topics (${summary.topics.length}):`, summary.topics);
      log.info('Image:', summary.img);
    });
  },
};
