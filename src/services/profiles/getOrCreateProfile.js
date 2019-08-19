const Profile = require('../../models/profile');
const logError = require('../../util/logError');

async function getOrCreateProfile(userId) {
  let profile;
  try {
    profile = await Profile.findOne({ userId });
    if (profile) {
      return profile;
    }
    profile = new Profile({ userId });
    await profile.save();
    return profile;
  } catch (err) {
    logError(`[Profile/getProfile] Could not get profile for id: ${userId}`, err);
    throw err;
  }
}

module.exports = getOrCreateProfile;
