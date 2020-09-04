// Vendor libs
const { ApolloServer } = require('apollo-server-express');
const { buildFederatedSchema } = require('@apollo/federation');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Get enviroment variables
require('dotenv').config();

// Custom libs
const setupLogger = require('@ecommerce-sandbox-auth/common/src/logger/setup');
const i18nextSetup = require('@ecommerce-sandbox-auth/api-common/src/i18n/i18next-setup');

// Logger
const logger = require('@ecommerce-sandbox-auth/common/src/logger');

const { PORT, API_NAME, FALLBACK_LANGUAGE, NODE_ENV } = process.env;

// MongoDB connection
require('./db-conn');

// Custom libs
const resolvers = require('./resolvers');
const typeDefs = require('./type-defs');
const models = require('./models');

const run = async () => {
  // Apollo server setup
  const apolloServer = new ApolloServer({
    port: PORT,
    schema: buildFederatedSchema([
      {
        typeDefs,
        resolvers
      }
    ]),
    context: async ({ req, res }) => {
      const lng =
        req.headers && req.headers.lng ? req.headers.lng : FALLBACK_LANGUAGE;

      const { organization_id, store_id } = req.headers;
      return {
        req,
        res,
        lng,
        organizationId: organization_id,
        storeId: store_id,
        models,
        t: req.t
      };
    }
  });

  // Add express to GraphQL server
  const app = express();
  app.use(bodyParser.json());

  // i18next setup
  const localesPath = path.join(__dirname, '../../../locales');
  await i18nextSetup(app, localesPath);

  // Healthcheck
  app.get('/healthcheck', (req, res) => res.json('ok'));

  // Register logger on app init
  setupLogger(app, __dirname);

  apolloServer.applyMiddleware({ app });

  // Start server
  app.listen({ port: PORT }, () => {
    logger.info(
      `🚀${API_NAME} ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
};

// ---------------------------------------------------
// START SERVER
// ---------------------------------------------------
try {
  run();
} catch (e) {
  logger.error(
    `Error starting ${API_NAME} on ${NODE_ENV} mode`,
    e.message,
    e.stack
  );
}
