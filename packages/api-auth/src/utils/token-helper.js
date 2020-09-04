// Vendor libs
const { sign, verify } = require('jsonwebtoken');

// Get environment variables
require('dotenv').config();

module.exports.createAccessToken = user => {
  if (!user) {
    return null;
  }

  // Get secrets from env
  const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION } = process.env;

  // Create access token from user data
  const accessToken = sign(
    {
      organization: user.organizationId,
      storeId: user.storeId,
      userId: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION
    }
  );

  return accessToken;
};

module.exports.createRefreshToken = user => {
  if (!user) {
    return null;
  }

  const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION } = process.env;

  const refreshToken = sign(
    {
      organization: user.organizationId,
      storeId: user.storeId,
      userId: user.id
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRATION
    }
  );

  return refreshToken;
};
