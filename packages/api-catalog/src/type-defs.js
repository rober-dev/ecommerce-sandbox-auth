// Vendor libs
const { gql } = require('apollo-server-express');

// Custom libs
const baseTypeDefs = require('./base.type-defs');

module.exports = gql`
  ${baseTypeDefs}
`;
