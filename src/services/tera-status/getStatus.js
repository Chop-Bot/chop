const cheerio = require('cheerio');

function getServerFromTR($, tr, platform) {
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

function getStatus(html) {
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
        serverStatus.servers.push(getServerFromTR($, server, serverStatus.platform));
      });

    serverStatuses.push(serverStatus);
  });

  return serverStatuses;
}

module.exports = getStatus;
