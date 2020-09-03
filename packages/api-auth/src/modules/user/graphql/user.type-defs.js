// Vendor libs
const { gql } = require('apollo-server-express');

module.exports = gql`
  type User @key(fields: "id") {
    id: ID!
    storeId: String!
    store: Store!
    email: String!
    username: String!
    salt: String!
    hash: String!
    lastLogin: String
    roles: [ROLE!]!
    createdAt: String!
    updatedAt: String!
  }

  input AddNewUserInput {
    storeId: String!
    email: String!
    username: String!
    salt: String!
    hash: String!
    lastLogin: String
    roles: [ROLE!]!
  }

  input UpdateUserInput {
    id: ID!
    storeId: String!
    email: String!
    username: String!
    salt: String!
    hash: String!
    lastLogin: String
    roles: [ROLE!]!
  }

  type UsersPaged {
    docs: [User!]!
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
    getAllUsers: [User!]!
    getUserById(id: ID!): User
    searchUsers(
      filter: String
      page: Int
      limit: Int
      sort: String
      asc: Int
    ): UsersPaged!
  }

  extend type Mutation {
    addNewUser(input: AddNewUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
