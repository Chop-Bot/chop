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

/*
request >> http://tera.enmasse.com/news/categories/windows

Array.from(document.querySelectorAll('.blog_post:not(.featured)')).filter(post =>
    post.querySelector('.platform_icon.windows')
);

request >> firstChild.href

for (h2 of document.querySelectorAll('.content h2')) {
    console.log(h2.innerText);
}
*/
