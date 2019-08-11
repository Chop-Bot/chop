module.exports = async function getVisibleChannes(guild) {
  const { channels } = guild;
  if (!channels) return [];
  const visibleChannels = channels.filter(c => c.type === 'text' && c.viewable);
  if (visibleChannels.size > 0) {
    return Array.from(visibleChannels).map(c => c[1]);
  }
  return [];
};
