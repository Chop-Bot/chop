module.exports = (cb) => {
  if (process.env.NODE_ENV === 'development') {
    cb();
  }
};

exports.isDev = process.env.NODE_ENV === 'development';
