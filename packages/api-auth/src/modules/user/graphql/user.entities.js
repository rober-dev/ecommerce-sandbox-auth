// Custom libs
const User = require('../user.model');
const Store = require('../../store/store.model');

module.exports = {
  async __resolverReference(object) {
    return User.findById(object.id);
  },
  async store(user) {
    return Store.findById(user.storeId);
  }
};
