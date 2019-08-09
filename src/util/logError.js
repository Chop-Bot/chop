const log = require('../config/log');

module.exports = (message, err, critical = false) => {
  let logger = log;
  if (critical) {
    logger = log.getLogger('critical');
  }
  logger.error(message);
  logger.error(err.message);
  logger.error(err.stack);
};
