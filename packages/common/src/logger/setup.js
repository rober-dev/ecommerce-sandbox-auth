// Vendor libs
const path = require('path');
const morgan = require('morgan');
const fse = require('fs-extra');
const rfs = require('rotating-file-stream');

const setup = async (app, currentPath) => {
  // Members
  const logDirectory = path.join(currentPath, '../', 'logs');
  const isProduction = process.env.NODE_ENV !== 'development';

  // Ensure log directory exists
  if (!fse.pathExistsSync(logDirectory)) {
    fse.mkdirSync(logDirectory);
  }

  // Errors rotating write stream
  const errorsLogStream = rfs.createStream('errors.log', {
    interval: '1d', // rotate daily
    path: logDirectory
  });

  if (!isProduction) {
    app.use(morgan('tiny'));
  }

  // Log only 4xx and 5xx responses to errors.log
  if (!isProduction) {
    app.use(
      morgan(
        'dev',
        { stream: errorsLogStream },
        {
          skip(req, res) {
            return res.statusCode < 400;
          }
        }
      )
    );
  }

  // Log only 4xx and 5xx responses to console
  app.use(
    morgan('dev', {
      skip(req, res) {
        return res.statusCode < 400;
      }
    })
  );
};

module.exports = setup;
