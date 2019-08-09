const express = require('express');

const log = require('./config/log');
const events = require('./events');

const port = process.env.PORT || 3000;

module.exports = () => {
  const app = express();

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
