module.exports.formatYupErrors = err => {
  let result = [];
  if (err && err.inner && err.inner.length > 0) {
    result = err.inner.map(e => {
      return {
        path: e.path,
        message: e.message // Message is already located
      };
    });

    return result;
  }
  return err.message ? err.message : err;
};
