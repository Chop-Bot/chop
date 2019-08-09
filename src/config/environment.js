const fs = require('fs');
const path = require('path');

require('dotenv').config();

const log = require('./log');

const REQUIRED_VARS = ['NODE_ENV', 'MONGODB_URI', 'TOKEN'];

let data = '';

let hasAllRequiredVars = true;

REQUIRED_VARS.forEach((VAR) => {
  if (!process.env[VAR]) {
    data += `${VAR}=\n`;
    hasAllRequiredVars = false;
  }
});

if (!hasAllRequiredVars) {
  const logger = log.getLogger('critical');
  logger.error('Oh no.');
  logger.error(
    'It seems you are missing one or more required enviroment variables this bot requires to function.',
  );
  logger.error('Could you please fill the generated .env file with the missing data?');
  logger.error('Note: You can move the generated .env somewhere else.');
  try {
    fs.writeFileSync(path.join(__dirname, '.env'), data, 'utf8');
  } catch {
    /* */
  }
  process.exit(1);
}

module.exports = () => 'OK';
