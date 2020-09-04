// Vendor libs
const {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
  ApolloError
} = require('apollo-server-express');

// Custom libs
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const logger = require('@ecommerce-sandbox-auth/common/src/logger');

module.exports = (type, method, msg, data, errors) => {
  let message = '';

  switch (type) {
    case GRAPHQL_ERROR.BAD_USER_INPUT:
      message = msg || 'FORBIDDEN';
      if (typeof errors === 'string') {
        message = errors;
      }
      logger.error(message, { method, errors, data });
      throw new UserInputError(message, { errors, data });

    case GRAPHQL_ERROR.FORBIDDEN:
      message = msg || 'FORBIDDEN';
      logger.error(message, { method, errors, data });
      throw new ForbiddenError(message, { errors, data });

    case GRAPHQL_ERROR.UNAUTHENTICATED:
      message = msg || 'UNAUTHENTICATED';
      logger.error(message, { method, errors, data });
      throw new AuthenticationError(message, { errors, data });

    default:
      message = msg || (typeof errors === 'string' ? errors : 'APOLLO_ERROR');
      logger.error(message, { method, errors, data });
      throw new ApolloError(message, { errors, data });
  }
};
