// Custom libs
const userQuery = require('./graphql/user.query');
const userMutation = require('./graphql/user.mutation');
const userTypeDefs = require('./graphql/user.type-defs');
const User = require('./user.model');
const userEntities = require('./graphql/user.entities');

// Exportation
module.exports = {
  userResolver: {
    Query: userQuery,
    User: { ...userEntities },
    Mutation: userMutation
  },
  userTypeDefs,
  User
};
