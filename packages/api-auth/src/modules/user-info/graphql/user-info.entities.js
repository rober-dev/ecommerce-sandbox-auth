// Custom libs
const UserInfo = require('../user-info.model');
const User = require('../../user/user.model');

module.exports = {
  async __resolverReference(object) {
    return UserInfo.findById(object.id);
  },
  async user(userInfo) {
    return User.findById(userInfo.userId);
  }
};
