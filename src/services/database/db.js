const mongoose = require('mongoose');

const logError = require('../../util/logError');

const MONGODB_URI = process.env.MONGODB_URI;

function connect(cb) {
  mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(cb, (err) => {
      logError('[Database] Could not connect to database!', err, true);
    })
    .catch((err) => {
      process.exit(1);
    });
}

module.exports = connect;
