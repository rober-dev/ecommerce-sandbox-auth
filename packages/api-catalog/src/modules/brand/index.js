const brandQuery = require('./graphql/brand.query');
const brandTypeDefs = require('./graphql/brand.type-defs');

module.exports = {
  brandResolver: {
    Query: brandQuery
  },
  brandTypeDefs
};
