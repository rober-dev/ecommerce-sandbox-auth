// Vendor libs
const logger = require('@ecommerce-sandbox-auth/common/src/logger');
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');

// Get environment variables
require('dotenv').config();

module.exports = (err, user, loc) => {
  const code = err.extensions.code || err.code;
  const serviceName = err.extensions.serviceName || err.serviceName;
  const path = err && err.path ? err.path.join(' > ') : '';
  const { message } = err;
  const errors = err.extensions.errors || err.errors;

  const { APOLLO_LOG_ERRORS } = process.env;
  if (!APOLLO_LOG_ERRORS) {
    throw new Error('Environment parameter not setted: APOLLO_LOG_ERRORS');
  }

  const enabledLoggers = APOLLO_LOG_ERRORS.split('|');

  // Extract error message from error
  let errorMessage = serviceName ? serviceName.toUpperCase() : 'unkown-service';
  errorMessage = `${errorMessage} > ${path}\n`;
  errorMessage += `MESSAGE: ${message}\n`;

  if (errors) {
    errorMessage += `ERRORS: { \n`;
    Object.entries(errors).forEach(entry => {
      const key = entry[0];
      const value = JSON.stringify(entry[1]);
      errorMessage += `  ${key}: ${value} \n`;
    });
    errorMessage += `}\n`;
  }

  // Add user if exists
  if (user) {
    // Break line
    errorMessage += '\n';
    errorMessage += `USER: ${user.id} - ${user.email} \n`;
  }

  // Add loc if exists
  if (loc) {
    // Break line
    errorMessage += '\nLOCATION\n';
    errorMessage += `${loc.ip} - ${loc.hostname} \n`;
    errorMessage += `${loc.city}, ${loc.postal} - ${
      loc.region
    }, ${loc.country.toUpperCase()} \n`;
    errorMessage += `${loc.loc} ${loc.timezone} ${loc.org}\n`;
  }

  // Extract stactrace from error
  let stackTraceMessage = '\nSTACKTRACE:\n';
  const stacktraceMessage = err.extensions.exception.stacktrace;
  if (stacktraceMessage || stacktraceMessage.length > 0) {
    stackTraceMessage += stacktraceMessage.map(e => e.replace('   ', '\n'));
  }

  const separator =
    '----------------------------------------------------------------\n';

  const title = `\n${separator}${code}\n${separator}`;
  switch (code) {
    case GRAPHQL_ERROR.INTERNAL_SERVER_ERROR:
      // Verify if register error on logs
      if (enabledLoggers.indexOf(code) > -1) {
        logger.error(title + errorMessage + stackTraceMessage);
      }

      // Return formatted error
      return {
        statusCode: 500,
        code,
        message,
        errors
      };

    case GRAPHQL_ERROR.FORBIDDEN:
      // Verify if register error on logs
      if (enabledLoggers.indexOf(code) > -1) {
        logger.warn(errorMessage + stackTraceMessage + separator);
      }

      // Return formatted error
      return {
        statusCode: 403,
        code,
        message,
        errors
      };

    case GRAPHQL_ERROR.UNAUTHENTICATED: // Verify if register error on logs
      if (enabledLoggers.indexOf(code) > -1) {
        logger.debug(errorMessage, stackTraceMessage + separator);
      }

      // Return formatted error
      return {
        statusCode: 401,
        code,
        message,
        errors
      };

    case GRAPHQL_ERROR.BAD_USER_INPUT:
      if (enabledLoggers.indexOf(code) > -1) {
        logger.debug(errorMessage, stackTraceMessage + separator);
      }

      // Return formatted error
      return {
        statusCode: 400,
        code,
        message,
        errors
      };

    default:
      // Always register unhandled error
      logger.error(errorMessage + stackTraceMessage + separator);

      // Return formatted error
      return {
        statusCode: 400,
        code,
        message,
        errors
      };
  }
};
