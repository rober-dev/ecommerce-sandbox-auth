// Custom libs
const userInfoQuery = require('./graphql/user-info.query');
const userInfoMutation = require('./graphql/user-info.mutation');
const userInfoTypeDefs = require('./graphql/user-info.type-defs');
const UserInfo = require('./user-info.model');
const userInfoEntities = require('./graphql/user-info.entities');

// Exportation
module.exports = {
  userInfoResolver: {
    Query: userInfoQuery,
    UserInfo: { ...userInfoEntities },
    Mutation: userInfoMutation
  },
  userInfoTypeDefs,
  UserInfo
};
