// Vendor libs
const { gql } = require('apollo-server-express');

module.exports = gql`
  type Store @key(fields: "id") {
    id: ID!
    organizationId: String!
    organization: Organization
    name: String!
    domain: String!
    createdAt: String!
    updatedAt: String!
  }

  input addNewStoreInput {
    organizationId: String!
    name: String!
    domain: String!
  }

  input updateStoreInput {
    id: ID!
    organizationId: String!
    name: String!
    domain: String!
  }

  type StoresPaged {
    docs: [Store!]!
    hasNextPage: Int
    hasPrevPage: Int
    limit: Int
    nextPage: Int
    page: Int
    pagingCounter: Int
    prevPage: Int
    totalDocs: Int
    totalPages: Int
  }

  extend type Query {
    getAllStores: [Store!]!
    getStoreById(id: ID!): Store!
    searchStores(
      filter: String
      page: Int
      limit: Int
      sort: String
      asc: Int
    ): StoresPaged
  }

  extend type Mutation {
    addNewStore(input: addNewStoreInput!): Store!
    updateStore(input: updateStoreInput!): Store!
    deleteStore(id: ID!): Boolean!
  }
`;
