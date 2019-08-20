const fs = require('fs');
const path = require('path');
const util = require('util');

const read = util.promisify(fs.readFile);

const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

const logError = require('../../util/logError');

const TeraHelper = require('./TeraHelper');

class TeraStatusReader {
  constructor() {
    throw new Error('TeraStatusReader cannot be instantiated.');
  }

  static async fetchAndRead() {
    try {
      const html = await TeraHelper.fetchPage(
        TeraHelper.parseUrl('support/server-status'),
        null,
        true,
      );
      const statuses = this.crawl(html);
      return statuses;
    } catch (err) {
      logError('[Tera/Status] Failed to fetch tera status.', err);
      throw err;
    }
  }

  static async fetchFakeAndRead() {
    try {
      const html = await read(path.join(__dirname, 'status-sample.html'));
      const statuses = this.crawl(html);
      return statuses;
    } catch (err) {
      logError('[Tera/Status] Failed to fetch fake tera status.', err);
      throw err;
    }
  }

  static async crawl(html) {
    const serverStatuses = [];
    const $ = cheerio.load(html);
    const $statuses = $('.serverstatuses');

    $statuses.find('.server_stat_block').each((_, block) => {
      const serverStatus = { name: '', servers: [], platform: '' };
      serverStatus.name = $(block)
        .find('h3')
        .text();

      // The the text before the first space e.g. PS4 (EU) -> PS4
      serverStatus.platform = serverStatus.name.match(/.+?(?=(\s))/gi)[0];

      $(block)
        .find('tbody')
        .children()
        .each((_, server) => {
          serverStatus.servers.push(parseServerRow(server, serverStatus.platform));
        });

      serverStatuses.push(serverStatus);
    });

    function parseServerRow(tr, platform) {
      const server = {
        name: '',
        type: '',
        status: true,
        platform,
      };
      let current = $(tr)
        .find('td')
        .first();
      for (let i = 0; i < 3; i++) {
        if (i === 0) {
          server.status = !!current
            .children()
            .first()
            .text()
            .replace(/\s+/gi, '')
            .includes('UP');
        }
        if (i === 1) {
          server.name = current.text();
        }
        if (i === 2) {
          server.type = current.text();
        }
        current = current.next();
      }
      return server;
    }

    return serverStatuses;
  }

  static buildEmbed(statuses) {
    const embed = new MessageEmbed().setColor(3447003).setDescription('Tera Server Status (NA)');
    statuses.forEach((currentStatus) => {
      currentStatus.servers.forEach((server) => {
        embed.addField(
          `${server.name}(${currentStatus.platform})`,
          server.status ? '💚UP' : '💔DOWN',
          true,
        );
      });
    });
    return embed;
  }
}

module.exports = TeraStatusReader;
