const cheerio = require('cheerio');

const log = require('../../config/log');

function getNews(html) {
  const news = [];
  const $ = cheerio.load(html);
  const $posts = $('.blog_post:not(.featured)');
  $posts.find('.copy header h2 a').each(function each(i, el) {
    news.push({ title: el.children[0].data, href: $(this).attr('href') });
  });
  return news;
}

module.exports = getNews;
