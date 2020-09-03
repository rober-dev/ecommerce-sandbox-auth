// Custom libs
const Store = require('../store.model');
const Organization = require('../../organization/organization.model');

module.exports = {
  async __resolveReference(object) {
    return Store.findById(object.id);
  },
  async organization(store) {
    const result = await Organization.findById(store.organizationId);
    return result;
  }
};
