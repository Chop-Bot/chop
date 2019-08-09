const mongoose = require('mongoose');

const log = require('./log');

const MONGODB_URI = process.env.MONGODB_URI;

function connect(cb) {
  mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(cb, (err) => {
      log.getLogger('critical').error('[Database] Could not connect to database!');
      log.getLogger('critical').error(err.message);
      log.getLogger('critical').error(err.stack);
    })
    .catch((err) => {
      process.exit(1);
    });
}

module.exports = connect;
