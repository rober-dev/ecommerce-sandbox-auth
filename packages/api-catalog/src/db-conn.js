// Vendor libs
const mongoose = require('mongoose');
const bluebird = require('bluebird');

// Get environment values
require('dotenv').config();

// Set mongoose Promise to Bluebird
mongoose.Promise = bluebird;

// Members
const { NODE_ENV, MONGODB_URL } = process.env;

// Retry connection
const connectWithRetry = () => {
  console.info(`Connection to MongoDB connection ${MONGODB_URL} with retry`);
  return mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
};

// Exit application on error
mongoose.connection.on('error', err => {
  console.error(`Error connecting to MongoDB ${MONGODB_URL}: ${err}`);
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('connected', () => {
  console.info(`MongoDB is connected on ${MONGODB_URL}`);
});

if (NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

const connect = () => {
  connectWithRetry();
};

module.exports = connect();
