// Custom libs
const Store = require('./store.model');
const storeTypeDefs = require('./graphql/store.type-defs');
const storeQuery = require('./graphql/store.query');
const storeEntities = require('./graphql/store.entities');
const storeMutation = require('./graphql/store.mutation');

module.exports = {
  storeResolver: {
    Mutation: storeMutation,
    Store: { ...storeEntities },
    Query: storeQuery
  },
  storeTypeDefs,
  Store
};
