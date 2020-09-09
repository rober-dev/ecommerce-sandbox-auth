// Vendor libs
const mongoose = require('mongoose');

// Custom libs
const Store = require('../modules/store/store.model');
const data = require('../../data/stores.json');

async function createIndexes() {
  // Ensure indexes

  await mongoose.connection.db.collection('stores').createIndex({ name: 1 });
  await mongoose.connection.db.collection('stores').createIndex({ domain: 1 });

  await mongoose.connection.db
    .collection('stores')
    .createIndex({ name: 1, organizationId: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('stores')
    .createIndex({ domain: 1, organizationId: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('stores')
    .createIndex({ position: 1 });
}

module.exports = async (req, res) => {
  // Check environment
  const { NODE_ENV } = process.env;
  if (NODE_ENV !== 'test' && NODE_ENV !== 'development') {
    res.status(403).json('Method only available in test or development mode');
  }

  // Clean stores
  await Store.remove({});

  // Add indexes to collection
  await createIndexes();

  const stores = [];

  try {
    // Import json file
    data.forEach(async s => {
      const store = new Store();
      store.id = s._id;
      store.name = s.name;
      store.domain = s.domain;
      store.organizationId = s.organizationId;
      store.createdAt = s.createdAt;
      store.updatedAt = s.createdAt;

      stores.push(store);
    });

    const results = await Store.insertMany(stores);

    // Show results
    res.json(`${results.length} stores inserted`);
  } catch (err) {
    res.status(400).json(err);
  }
};
