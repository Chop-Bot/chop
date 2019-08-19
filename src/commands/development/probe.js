const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

const { Command } = require('chop-tools');
const slug = require('slug');

const log = require('../../config/log');
const parseUrl = require('../../services/tera-general/parseUrl');
const fetchPage = require('../../services/tera-general/fetchPage');

module.exports = new Command({
  name: 'probe',
  description: 'Probes the tera website at the specified endpoint',
  hidden: true,
  usage: '[endpoint]',
  run(message, args) {
    const url = parseUrl(args[0]);

    const start = Date.now();
    log.debug('[Tera/Probe] Probing', url);

    const filename = path.join(__dirname, `${slug(args[0] ? args[0] : 'home')}.html`);

    fetchPage(url)
      .then(html => writeFile(filename, html))
      .then(() => {
        log.debug('[Tera/Probe] Finished. Took', Date.now() - start, 'ms');
        log.debug('[Tera/Probe] Page saved to:', filename);
      })
      .catch(log.error);
  },
});
