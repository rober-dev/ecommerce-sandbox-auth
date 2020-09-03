// Vendor libs
const { gql } = require('apollo-server-express');

module.exports = gql`
  type Organization @key(fields: "id") {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  input AddNewOrganizationInput {
    name: String!
  }

  input UpdateOrganizationInput {
    id: ID!
    name: String!
  }

  type OrganizationsPaged {
    docs: [Organization!]!
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
    getAllOrganizations: [Organization!]!
    getOrganizationById(id: ID!): Organization
    searchOrganizations(
      filter: String
      page: Int
      limit: Int
      sort: String
      asc: Int
    ): OrganizationsPaged!
  }

  extend type Mutation {
    addNewOrganization(input: AddNewOrganizationInput): Organization!
    updateOrganization(input: UpdateOrganizationInput): Organization!
    deleteOrganization(id: ID!): Boolean!
  }
`;
