const Twitter = require('twitter');

const logError = require('../../util/logError');

class TwitterClient {
  constructor() {
    this.client = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: '',
      access_token_secret: '',
    });
    this.DEFAULT_PARAMS = { id: 117175394, count: 1, exclude_replies: true };
  }

  getLatestTeraTweetUrl() {
    return new Promise((resolve, reject) => {
      this.client.get(
        'statuses/user_timeline',
        { ...this.DEFAULT_PARAMS, count: 1 },
        (error, [tweets], response) => {
          if (error) {
            logError('[Twitter] Could not retrieve latest Tera Tweet.', error);
            reject(error);
            return;
          }
          // TODO: Save this to cache in case somone decides to spam the twitter command
          resolve(`https://twitter.com/TERAonline/status/${tweets.id_str}`);
        },
      );
    });
  }

  getLatestTeraTweetID() {
    return new Promise((resolve, reject) => {
      this.client.get(
        'statuses/user_timeline',
        { ...this.DEFAULT_PARAMS, count: 1 },
        (error, tweets, response) => {
          if (error) {
            logError('[Twitter] Could not retrieve latest Tera Tweet.', error);
            reject(error);
            return;
          }
          let tweet;
          try {
            tweet = tweets[0];
          } catch {
            const err = new Error(`Could not read tweets from: ${tweet}`);
            logError('[Twitter] Could not retrieve latest Tera Tweet.', err);
            reject(err);
            return;
          }
          // TODO: Save this to cache in case somone decides to spam the twitter command
          resolve(tweet.id_str);
        },
      );
    });
  }
}

module.exports = TwitterClient;
