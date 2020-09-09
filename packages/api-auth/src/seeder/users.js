// Vendor libs
const mongoose = require('mongoose');

// Custom libs
const User = require('../modules/user/user.model');
const data = require('../../data/users.json');

async function createIndexes() {
  // Ensure indexes
  await mongoose.connection.db.collection('users').createIndex({ storeId: 1 });

  await mongoose.connection.db
    .collection('users')
    .createIndex({ email: 1, storeId: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('users')
    .createIndex({ username: 1, storeId: 1 }, { unique: true });

  await mongoose.connection.db.collection('users').createIndex({ position: 1 });
}

module.exports = async (req, res) => {
  // Check environment
  const { NODE_ENV } = process.env;
  if (NODE_ENV !== 'test' && NODE_ENV !== 'development') {
    res.status(403).json('Method only available in test or development mode');
  }

  // Clean users
  await User.remove({});

  // Add indexes to collection
  await createIndexes();

  const users = [];

  try {
    // Import json file
    data.forEach(async u => {
      const user = new User();
      user.id = u._id;
      user.organizationId = u.organizationId;
      user.storeId = u.storeId;
      user.roles = u.roles;
      user.email = u.email;
      user.username = u.username;
      user.salt = u.salt;
      user.hash = u.hash;
      user.lastLogin = u.lastLogin;
      user.loginAttempts = u.loginAttempts;
      user.lockUntil = u.lockUntil;
      user.createdAt = u.createdAt;
      user.updatedAt = u.createdAt;
      users.push(user);
    });

    const results = await User.insertMany(users);

    // Show results
    res.json(`${results.length} users inserted`);
  } catch (err) {
    res.status(400).json(err);
  }
};
