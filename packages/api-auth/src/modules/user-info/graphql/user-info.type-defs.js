// Vendor libs
const { gql } = require('apollo-server-express');

module.exports = gql`
  type UserInfo @key(fields: "id") {
    id: ID!
    userId: String!
    user: User!
    firstName: String!
    lastName: String
    createdAt: String!
    updatedAt: String!
  }

  input AddNewUserInfoInput {
    userId: String!
    firstName: String!
    lastName: String
  }

  input UpdateUserInfoInput {
    id: ID!
    userId: String!
    firstName: String!
    lastName: String
  }

  type UsersInfoPaged {
    docs: [UserInfo!]!
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
    getAllUsersInfo: [UserInfo!]!
    getUserInfoById(id: ID!): UserInfo
    searchUsersInfo(
      filter: String
      page: Int
      limit: Int
      sort: String
      asc: Int
    ): UsersInfoPaged!
  }

  extend type Mutation {
    updateUserInfo(input: UpdateUserInfoInput!): UserInfo!
    addNewUserInfo(input: AddNewUserInfoInput!): UserInfo!
    deleteUserInfo(id: ID!): Boolean!
  }
`;
