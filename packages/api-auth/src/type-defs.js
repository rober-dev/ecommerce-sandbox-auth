// Vendor libs
const { gql } = require('apollo-server-express');

// Custom libs
const baseTypeDefs = require('./base.type-defs');
const { userTypeDefs } = require('./modules/user');
const { userInfoTypeDefs } = require('./modules/user-info');
const { organizationTypeDefs } = require('./modules/organization');
const { storeTypeDefs } = require('./modules/store');

module.exports = gql`
  ${baseTypeDefs}
  ${userTypeDefs}
  ${userInfoTypeDefs}
  ${organizationTypeDefs},
  ${storeTypeDefs}
`;
