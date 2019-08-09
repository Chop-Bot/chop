const cheerio = require('cheerio');

function getSummary(html) {
  const topics = [];
  const $ = cheerio.load(html);
  const $blogPost = $('#show_blog_post');

  // get title
  const title = $blogPost.find('#content_article_header h1').text();

  // get header image
  let img = $blogPost.find('.content img').attr('src');
  if (!img) {
    img = $blogPost.find('img').attr('src');
  }

  // get topics
  $blogPost.find('.content h2').each((i, el) => {
    topics.push($(el).text());
  });

  if (topics.length < 1) {
    $blogPost.find('.content h3').each((i, el) => {
      topics.push($(el).text());
    });
  }

  return { title, topics: [...new Set(topics)], img };
}

module.exports = getSummary;
