// Vendor libs
const mongoose = require('mongoose');

// Custom libs
const UserInfo = require('../modules/user-info/user-info.model');
const data = require('../../data/users-info.json');

async function createIndexes() {
  // Ensure indexes
  await mongoose.connection.db.collection('user-info').createIndex({ _id: 1 });

  await mongoose.connection.db
    .collection('user-info')
    .createIndex({ userId: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('user-info')
    .createIndex({ firstName: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('user-info')
    .createIndex({ lastName: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('user-info')
    .createIndex({ position: 1 });
}

module.exports = async (req, res) => {
  // Check environment
  const { NODE_ENV } = process.env;
  if (NODE_ENV !== 'test' && NODE_ENV !== 'development') {
    res.status(403).json('Method only available in test or development mode');
  }

  // Clean userInfos
  await UserInfo.remove({});

  // Add indexes to collection
  await createIndexes();

  const userInfos = [];

  try {
    // Import json file
    data.forEach(async u => {
      const userInfo = new UserInfo();
      userInfo.id = u._id;
      userInfo.userId = u.userId;
      userInfo.firstName = u.firstName;
      userInfo.lastName = u.lastName;
      userInfo.createdAt = u.createdAt;
      userInfo.updatedAt = u.createdAt;

      userInfos.push(userInfo);
    });

    const results = await UserInfo.insertMany(userInfos);

    // Show results
    res.json(`${results.length} userInfos inserted`);
  } catch (err) {
    res.status(400).json(err);
  }
};
