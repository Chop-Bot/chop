const mongoose = require('mongoose');

const logError = require('../../util/logError');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

function connect(cb) {
  mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true })
    .then(cb, (err) => {
      logError('[Database] Could not connect to database!', err, true);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = connect;
