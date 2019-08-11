const prompter = require('discordjs-prompter');

const promptAndHandle = require('./promptAndHandle');

const buildPrompt = async (options, message, promptMessage) => {
  const formatOptions = (opts) => {
    const cap = str => str
      .split(' ')
      .map(s => s[0].toUpperCase() + s.substr(1))
      .join(' ');
    return Array.from(opts).reduce((acc, cur) => {
      const emoji = cur[0];
      const label = cur[1].label;
      return emoji === 'timeout' ? acc : `${acc + emoji}: ${cap(label.toString())}\n`;
    }, '');
  };
  const optionsFormatted = formatOptions(options);
  return prompter.choice(message.channel, {
    question: `**${promptMessage}**\n${optionsFormatted}`,
    choices: Array.from(options)
      .map(kv => kv[0])
      .filter(e => e !== 'timeout'),
    deleteMessage: true,
    userId: message.author.id,
    timeout: 60000,
  });
};

// options -> Map { 'emoji⚡': { label: 'Options Label', handle: Async Function } }
module.exports = async (
  options,
  message,
  promptMessage = 'What kind of event should I notify?',
) => {
  options.set('❌', { label: 'cancel', handle: async () => 'CANCEL' });
  const prompt = buildPrompt(options, message, promptMessage);

  // response -> emoji | null
  return promptAndHandle(prompt, async (response) => {
    const chosenOption = options.get(response);
    if (chosenOption) {
      const handleResponse = await chosenOption.handle(message);
      return handleResponse;
    }
    const timeout = options.get('timeout');
    if (timeout) {
      const timoutHandleResponse = await timeout.handle(message);
      return timoutHandleResponse;
    }
    return null;
  });
};
