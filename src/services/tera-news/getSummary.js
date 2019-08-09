const cheerio = require('cheerio');

function getSummary(html) {
  const topics = [];
  const $ = cheerio.load(html);
  const $blogPost = $('#show_blog_post');

  // get title
  const title = $blogPost.find('#content_article_header h1').text();

  // get header image
  const img = $blogPost.find('.content img').attr('src');

  // get topics
  $blogPost.find('.content h2').each((i, el) => {
    topics.push($(el).text());
  });

  return { title, topics, img };
}

module.exports = getSummary;
