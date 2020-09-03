// Custom libs
const organizationQuery = require('./graphql/organization.query');
const organizationMutation = require('./graphql/organization.mutation');
const organizationTypeDefs = require('./graphql/organization.type-defs');
const Organization = require('./organization.model');

// Exportation
module.exports = {
  organizationResolver: {
    Query: organizationQuery,
    Mutation: organizationMutation
  },
  organizationTypeDefs,
  Organization
};
