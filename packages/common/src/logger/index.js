// Vendor libs
const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const filenameDebugInfo = path.join(logDir, 'info.log');
const filenameWarnError = path.join(logDir, 'errors.log');

// Set Log level
const getLevel = () => {
  let result = '';
  switch (env) {
    case 'production':
      result = 'info';
      break;
    case 'development':
      result = 'debug';
      break;
    default:
      result = 'error';
      break;
  }
  return result;
};

const logger = createLogger({
  // change level if in dev environment versus production
  level: getLevel(),
  format: format.combine(
    format.label({
      label: process.mainModule
        ? path.basename(process.mainModule.filename)
        : 'label'
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    }),
    new transports.File({
      filename: filenameDebugInfo,
      format: format.combine(
        format.printf(
          info =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    }),
    new transports.File({
      filename: filenameWarnError,
      level: 'warn',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
      )
    })
  ]
});

module.exports = logger;
