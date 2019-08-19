const { Command } = require('chop-tools');

const log = require('../../config/log');
const fetchNews = require('../../services/tera-news/fetchNews');
const TeraNews = require('../../models/teraNews');

module.exports = new Command({
  name: 'savenews',
  description: 'Saves the current tera news to the database. (For Development)',
  hidden: true,
  run: async (message) => {
    const news = await fetchNews();
    log.debug('Tera news:', news);
    const tn = new TeraNews({
      date: new Date(),
      news,
    });
    await tn.save();
    message.channel.send('Done!');
  },
});
