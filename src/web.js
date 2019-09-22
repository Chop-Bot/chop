const express = require('express');

const log = require('./config/log');
const cache = require('./services/cache/cache');
const events = require('./events');

const port = process.env.PORT || 3000;

module.exports = () => {
  const app = express();

  app.get('/commands', (req, res) => {
    cache.client
      .get('commands')
      .then((data) => {
        if (data) {
          res.status(200).json(JSON.parse(data));
        } else {
          res.status(200).json({ message: 'Could not find resource.' });
        }
      })
      .catch((err) => {
        res.status(500).end();
      });
  });

  app.get('*', (req, res) => {
    res.send("It's coffee time!");
  });

  const server = app.listen(port, () => {
    events.on('kill', () => {
      log.info('[Web] Shutting down.');
      server.close();
    });
  });

  log.info(`[Web] Express server listening at port ${port}.`);
};
