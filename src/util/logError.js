const log = require('../config/log');

module.exports = (message, err, critical = false) => {
  let logger = log;
  if (critical) {
    logger = log.getLogger('critical');
  }
  logger.error(message);
  if (err.message && !err.message.includes('Page not found')) logger.error(err.message);
  logger.error(err.stack);
  logger.error(
    `Stack to logError\n${new Error().stack
      .split('\n')
      .slice(1)
      .join('\n')}`,
  );
};
