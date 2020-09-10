// Vendor libs
const jwt = require('jsonwebtoken');
const logger = require('../logger');

module.exports.decodeToken = (token, ACCESS_TOKEN_SECRET) => {
  // Decode Access Token
  // Check Token Secret has been setted on environment variables
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error(
      `ACCESS_TOKEN_SECRET is not setted on environment variables`
    );
  }

  // Check token is not null or empty
  if (!token) {
    return null;
  }

  // Check word Bearer is present in token
  let t = null;
  if (!token.toUpperCase().startsWith('BEARER ')) {
    logger.warn(
      `Token "${token}" is not valid because it does not start with "Bearer "`
    );
  } else {
    // eslint-disable-next-line prefer-destructuring
    t = token.slice(7, token.length);
  }

  // Lets decode
  if (t) {
    try {
      return jwt.verify(t, ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name) {
        switch (err.name) {
          case 'TokenExpiredError':
            // logger.debug(`Access Token expired on ${moment(err.expiredAt)}. TOKEN: ${token}`);
            return null;
          case 'JsonWebTokenError':
            logger.warn(
              `Access Token is invalid (${err.message}). TOKEN: ${token}`
            );
            return null;
          case 'NotBeforeError':
            logger.warn(`Access Token is not active. TOKEN: ${token}`);
            return null;
          default:
            logger.warn(
              `Error trying decode token. ${
                err.message || ''
              }. TOKEN: ${token}`,
              err
            );
            return null;
        }
      }
      logger.warn(
        `Error trying decode token . ${err.message || ''}. TOKEN: ${token}`,
        err
      );
      return null;
    }
  }

  return null;
};
