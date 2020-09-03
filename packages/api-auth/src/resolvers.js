// Vendor libs
const { _ } = require('lodash');

// Custom libs
const { userResolver } = require('./modules/user');
const { userInfoResolver } = require('./modules/user-info');
const { organizationResolver } = require('./modules/organization');
const { storeResolver } = require('./modules/store');

// Exportation
module.exports = _.merge(
  {},
  userResolver,
  userInfoResolver,
  organizationResolver,
  storeResolver
);
