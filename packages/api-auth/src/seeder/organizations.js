// Vendor libs
const mongoose = require('mongoose');

// Custom libs
const Organization = require('../modules/organization/organization.model');
const data = require('../../data/organizations.json');

async function createIndexes() {
  // Ensure indexes

  await mongoose.connection.db
    .collection('organizations')
    .createIndex({ name: 1 }, { unique: true });

  await mongoose.connection.db
    .collection('organizations')
    .createIndex({ position: 1 });
}

module.exports = async (req, res) => {
  // Check environment
  const { NODE_ENV } = process.env;
  if (NODE_ENV !== 'test' && NODE_ENV !== 'development') {
    res.status(403).json('Method only available in test or development mode');
  }

  // Clean organizations
  await Organization.remove({});

  // Add indexes to collection
  await createIndexes();

  const organizations = [];

  try {
    // Import json file
    data.forEach(async o => {
      const organization = new Organization();
      organization.id = o._id;
      organization.name = o.name;
      organization.createdAt = o.createdAt;
      organization.updatedAt = o.createdAt;

      organizations.push(organization);
    });

    const results = await Organization.insertMany(organizations);

    // Show results
    res.json(`${results.length} organizations inserted`);
  } catch (err) {
    res.status(400).json(err);
  }
};
