// Vendor lisb
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Custom libs
const { User } = require('../../src/models');

const mongod = new MongoMemoryServer();
mongoose.Promise = bluebird;

const models = {
  User
};

const cleanDB = async done => {
  await models.User.deleteMany({});
  done();
};

const connectToDB = async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useCreateIndex', true);
  const connectionString = await mongod.getConnectionString(
    'ecommerce-sandbox-auth'
  );
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

const generateMongooseId = () => {
  return mongoose.Types.ObjectId();
};

// Irrelevant test
it('', () => expect(1).toEqual(1));

// eslint-disable-next-line jest/no-export
module.exports = {
  cleanDB,
  connectToDB,
  disconnectDB,
  generateMongooseId,
  models
};
