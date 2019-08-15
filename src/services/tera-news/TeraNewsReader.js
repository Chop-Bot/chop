const fs = require('fs');
const path = require('path');
const util = require('util');

const read = util.promisify(fs.readFile);

const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

const logError = require('../../util/logError');
const fetchPage = require('../tera-general/fetchPage');
const parseUrl = require('../tera-general/parseUrl');
const emojis = require('../../config/constants').PLATFORM_EMOJIS;

class TeraNewsReader {
  constructor() {
    throw new Error('TeraNewsReader cannot be instantiated.');
  }

  static async fetchAndRead(filter = 'ALL', ignoreCache = false) {
    let route = 'all';
    if (filter === 'ALL') route = 'all';
    if (filter === 'PC') route = 'windows';
    if (filter === 'PS4') route = 'playstation';
    if (filter === 'XBOX') route = 'xbox';

    try {
      const html = await fetchPage(
        parseUrl(`news/categories/${route}`),
        ignoreCache ? null : 5 * 60,
        ignoreCache,
      );
      const news = this.crawl(html);
      return news;
    } catch (err) {
      logError('[Tera/News] Failed to fetch tera news.', err);
      throw err;
    }
  }

  static async fetchFakeAndRead() {
    try {
      const html = await read(path.join(__dirname, './fake-sample.html'));
      const news = this.crawl(html);
      return news;
    } catch (err) {
      logError('[Tera/News] Failed to fetch tera news.', err);
      throw err;
    }
  }

  static async crawl(html) {
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
        .text()
        .trim();
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
        title,
        href,
        content,
        platforms,
      });
    });
    return news;
  }

  static async crawlSummary(html) {
    const topics = [];
    const $ = cheerio.load(html);
    const $blogPost = $('#show_blog_post');

    const title = $blogPost.find('#content_article_header h1').text();

    // get header image
    let img = $blogPost.find('.content img').attr('src');
    if (!img) img = $blogPost.find('img').attr('src');

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

  /**
   * Builds a summary embed
   * @param {Object} post
   * @param {String} post.title The post title
   * @param {String} post.content A brief summary of the post contents
   * @param {String} post.href Relative url to the post
   * @param {String[]} post.platforms Post platforms, can only be `PC`, `PS4`, `XBOX`
   * @param {String[]} post.topics A list of topics in the post
   * @param {String} post.img Absolute url to the image of the post
   * @returns {external:MessageEmbed} A new MessageEmbed
   */
  static async buildEmbed(post) {
    const embed = new MessageEmbed().setColor(3447003).setDescription('Tera News (NA)');
    embed.addField(
      `${this.getEmojis(post.platforms)}${post.title}`,
      `${post.content} [Read on Tera Website](${parseUrl(post.href)})`,
    );
    const newsSummary = post.topics.map(t => `▫${t}`);
    if (newsSummary.length > 0) {
      embed.addField('Summary', newsSummary);
    }
    embed.setImage(post.img);
    return embed;
  }

  static async getEmojis(platforms) {
    const newsEmojis = this.parsePlatforms(platforms).reduce((acc, cur) => acc + emojis[cur], '');
    return newsEmojis;
  }

  static async parsePlatforms(filter) {
    const removeNonStrings = v => typeof v === 'string';
    const toUpper = v => v.toUpperCase();
    if (!filter || !(filter instanceof Array)) {
      return null;
    }
    const filtered = [
      ...new Set(
        filter
          .filter(removeNonStrings)
          .map(toUpper)
          .map((platform, i, arr) => {
            if (['PC', 'PS4', 'XBOX'].includes(platform)) return platform;
            if (platform === 'WINDOWS') return 'PC';
            if (platform === 'PLAYSTATION') return 'PS4';
            if (platform === 'CONSOLE') {
              arr.push('PS4', 'XBOX');
              return null;
            }
            return null;
          })
          .filter(v => !!v),
      ),
    ];
    return filtered;
  }
}

module.exports = TeraNewsReader;
