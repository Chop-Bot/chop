const log = require('../../config/log');
const Notification = require('../../models/notification');
const getVisibleChannels = require('../../services/discord/getVisibleChannels');
const configurationPromptAndHandle = require('../../services/discord/configurationPromptAndHandle');
const emoji = require('../../util/randomEmoji');

// TODO: Fetch these on the fly if user picks 🛰 Notifications
const defaultServers = ['Velika', 'Kaiator', 'Darkan', 'Meldita', 'Lakan', 'Yana'];

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

const configureTeraStatusNotifications = async (message) => {
  // Configure Tera Status Notification
  const thisGuildNotification = await Notification.findOneByGuild(message.guild.id);
  const chosenChannel = await pickChannel(
    message,
    thisGuildNotification && thisGuildNotification.teraStatus.notify
      ? thisGuildNotification.teraStatus.channel
      : null,
  );
  if (!chosenChannel) {
    await Notification.disableByType(message.guild.id, 'status');
    await message.channel.send('You will no longer receive Tera Status change notifications.');
    return;
  }
  if (chosenChannel === 'CANCEL') {
    return;
  }
  if (!thisGuildNotification) {
    // add new
    await Notification.createByType(message.guild.id, 'status', {
      notify: true,
      servers: defaultServers,
      channel: chosenChannel.id,
    });
  } else {
    await Notification.findAndUpdateStatus(message.guild.id, {
      notify: true,
      servers: defaultServers,
      channel: chosenChannel.id,
    });
  }

  // done!
  log.info(
    '[Configure]',
    message.author.tag,
    'configured the guild',
    message.guild.name,
    'to receive notifications!',
  );
  await message.channel.send(
    `You configured the channel <#${chosenChannel.id}> to receive Tera Status notifications.`,
  );
};

const configureNotifications = async (message) => {
  const notificationOptions = new Map([
    ['🔋', { label: 'Tera Status', handle: configureTeraStatusNotifications }],
    // ['📰', { label: 'Tera News', handle: configureTeraNewsNotifications }],
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
      ['🛰', { label: 'notifications', handle: configureNotifications }],
      // ['👌', 'placeholder'],
    ]);

    await configurationPromptAndHandle(configOptions, message, 'What do you want to configure?');

    await tryToDeleteMessage(message);
  },
};
