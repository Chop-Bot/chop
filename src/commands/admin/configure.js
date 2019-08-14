const log = require('../../config/log');
const Notification = require('../../models/notification');
const getVisibleChannels = require('../../services/discord/getVisibleChannels');
const configurationPromptAndHandle = require('../../services/discord/configurationPromptAndHandle');
const emoji = require('../../util/randomEmoji');
const cap = require('../../util/cap');

// TODO: Fetch these on the fly if user picks 🛰 Notifications
const defaults = (type) => {
  switch (type) {
    case 'news':
      return ['PC', 'PS4', 'XBOX'];
    case 'status':
      return ['Velika', 'Kaiator', 'Darkan', 'Meldita', 'Lakan', 'Yana'];
    case 'twitter':
      return ['NA'];
    default:
      // ????
      return [];
  }
};

const tryToDeleteMessage = (message) => {
  try {
    return message.delete();
  } catch (e) {
    return Promise.resolve();
  }
};

const pickChannel = async (message, currentChannelInDb) => {
  const visibleChannels = await getVisibleChannels(message.guild);
  const emojis = emoji(visibleChannels.length);
  const channels = new Map();
  if (currentChannelInDb) {
    channels.set('💔', {
      label: `Cancel Notifications - Current Channel: <#${currentChannelInDb}>`,
      handle: async () => null,
    });
  }
  visibleChannels.forEach((c, i) => {
    channels.set(emojis[i], {
      label: {
        channel: c,
        toString: () => `<#${c.id}>`,
      },
      handle: async () => c,
    });
  });

  if (channels.size < 1) {
    await message.channel.send(
      'Chop cannot see any channels in your server. Are the permissions set correctly?',
    );
    return null;
  }

  channels.set('timeout', { handle: async () => 'CANCEL' });

  const channelResponse = await configurationPromptAndHandle(
    channels,
    message,
    'Which channel should I send these notifications?',
  );

  return channelResponse;
};

const configureNotifications = async (message, type) => {
  const guild = message.guild.id;
  // Configure Tera Status Notification
  const thisGuildNotification = await Notification.findOneByGuildAndType({
    guild,
    type,
  });
  const chosenChannel = await pickChannel(
    message,
    thisGuildNotification ? thisGuildNotification.channel : null,
  );
  // if chosenChannel === null user chose remove notifications
  if (!chosenChannel) {
    await thisGuildNotification.deleteOne();
    await message.channel.send(`You will no longer receive Tera ${cap(type)} notifications.`);
    return;
  }
  // if chosenChannel === 'CANCEL' user chose cancel or timed out
  if (chosenChannel === 'CANCEL') {
    return;
  }
  // user chose a channel, save it to db
  if (!thisGuildNotification) {
    await Notification.createNotification({
      guild,
      type,
      subject: defaults(type),
      channel: chosenChannel.id,
    });
  } else {
    await Notification.findAndUpdateNews({
      guild,
      type,
      newInfo: {
        subject: defaults(type),
        channel: chosenChannel.id,
      },
    });
  }

  // done!
  log.info(
    '[Configure]',
    message.author.tag,
    'configured the guild',
    message.guild.name,
    'to receive Tera',
    cap(type),
    'notifications!',
  );
  await message.channel.send(
    `You configured the channel <#${chosenChannel.id}> to receive Tera ${cap(type)} notifications.`,
  );
};

const configureNewNotification = async (message) => {
  const notificationOptions = new Map([
    ['🔋', { label: 'Tera Status', handle: async msg => configureNotifications(msg, 'status') }],
    ['📰', { label: 'Tera News', handle: async msg => configureNotifications(msg, 'news') }],
    ['🐦', { label: 'Tera Tweets', handle: async msg => configureNotifications(msg, 'twitter') }],
  ]);
  await configurationPromptAndHandle(
    notificationOptions,
    message,
    'What kind of notification do you want to set?',
  );
};

module.exports = {
  name: 'configure',
  description: 'Command for server moderators to configure Chop Bot.',
  admin: true,
  execute: async (message) => {
    const configOptions = new Map([
      ['🛰', { label: 'notifications', handle: configureNewNotification }],
      // ['👌', 'placeholder'],
    ]);

    await configurationPromptAndHandle(configOptions, message, 'What do you want to configure?');

    await tryToDeleteMessage(message);
  },
};
