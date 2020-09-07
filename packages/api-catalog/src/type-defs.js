// Vendor libs
const { gql } = require('apollo-server-express');

// Custom libs
const baseTypeDefs = require('./base.type-defs');
const { brandTypeDefs } = require('./modules/brand');

module.exports = gql`
  ${baseTypeDefs}
  ${brandTypeDefs}
`;
