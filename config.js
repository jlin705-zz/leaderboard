
const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

export const logStars = function(message) {
  console.info('**********');
  console.info(message);
  console.info('**********');
};

export default {
  searchEngineId: '008609127627542274017:bfdmtkhyyto',
  searchEngineApiKey: 'AIzaSyBpZ9ydOtT9vMfY2AaFi4ang2gSjP_avUY',
  giphyPublicKey: 'dc6zaTOxFJmzC',
  mongodbUri: 'mongodb://localhost:27017/leaderboarddb',
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  }
};
