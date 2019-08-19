const ChopTools = require('chop-tools');

const log = require('./config/log');
const logError = require('./util/logError');
const events = require('./events');
const getOrCreateProfile = require('./services/profiles/getOrCreateProfile');
const TwitterClient = require('./services/twitter/TwitterClient');

module.exports = function bot() {
  const client = new ChopTools.Client();

  Object.defineProperty(client, 'twitter', { value: new TwitterClient(), writable: false });

  client.on('ready', () => {
    log.info(`[Discord] It's coffee time! [${client.user.tag}]`);
  });

  client.on('error', (err) => {
    logError('[Discord] A discord error happened.', err);
  });

  client.use(async (call, next) => {
    getOrCreateProfile(call.caller)
      .then((profile) => {
        call.profile = profile;
        log.info(`[Profile] Created profile for ${call.callerTag}`);
        next();
      })
      .catch(() => {});
  });

  events.on('kill', () => client.destroy());

  client
    .login(process.env.TOKEN)
    .then(() => log.info('[Discord] Log in successful.'))
    .catch((err) => {
      logError('[Discord] Could not login to Discord. Exiting...', err, true);
      process.exit(1);
    });
};
