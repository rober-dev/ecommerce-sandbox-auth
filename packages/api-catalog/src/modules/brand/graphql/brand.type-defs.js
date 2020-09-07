// Vendor libs
const { gql } = require('apollo-server-express');

// Type definitions
module.exports = gql`
  type Brand {
    id: ID!
    name: String!
  }

  extend type Query {
    getAllBrands: [Brand!]!
  }
`;
