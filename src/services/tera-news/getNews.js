const cheerio = require('cheerio');

const log = require('../../config/log');

function getNews(html) {
  const news = [];
  const $ = cheerio.load(html);
  const $posts = $('.blog_post:not(.featured)');

  $posts.find('.copy header h2 a').each(function each(i, el) {
    const title = $(el).text();
    const href = $(this).attr('href');
    const content = $(el)
      .parent()
      .parent()
      .next()
      .text();
    const platforms = [];
    const icons = $(el)
      .parent()
      .parent();
    if (icons.find('.windows').length) {
      platforms.push('PC');
    }
    if (icons.find('.xbox').length) {
      platforms.push('XBOX');
    }
    if (icons.find('.playstation').length) {
      platforms.push('PS4');
    }
    news.push({
      title, href, content, platforms,
    });
  });
  return news;
}

module.exports = getNews;
