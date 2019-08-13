const { MessageEmbed } = require('discord.js');

const getNewsEmojis = require('./getNewsEmojis');
const parseUrl = require('../tera-general/parseUrl');

/**
 * Builds a summary embed
 * @param {Object} post
 * @param {String} post.title The post title
 * @param {String} post.content A brief summary of the post contents
 * @param {String} post.href Relative url to the post
 * @param {String[]} post.platforms Post platforms, can only be `PC`, `PS4`, `XBOX`
 * @param {String[]} post.topics A list of topics in the post
 * @param {String} post.img Absolute url to the image of the post
 */
function buildEmbed(post) {
  const embed = new MessageEmbed().setColor(3447003).setDescription('Tera News (NA)');
  embed.addField(
    `${getNewsEmojis(post.platforms)}${post.title}`,
    `${post.content} [Read on Tera Website](${parseUrl(post.href)})`,
  );
  const newsSummary = post.topics.map(t => `▫${t}`);
  if (newsSummary.length > 0) {
    embed.addField('Summary', newsSummary);
  }
  embed.setImage(post.img);
  return embed;
}

module.exports = buildEmbed;
