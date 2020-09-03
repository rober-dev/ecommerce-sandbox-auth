// Vendor libs
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Apollo libs
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');

// Custom libs
const logger = require('@minimal-ecommerce-sandbox/common/src/logger');
const ipHelper = require('@minimal-ecommerce-sandbox/common/src/helpers/ip-helper');
const i18nextSetup = require('@minimal-ecommerce-sandbox/api-common/src/i18n/i18next-setup');

// Helpers
const apolloErrorFormatter = require('../helpers/apollo-error-formatter');

// Load environment variables
dotenv.config();

// Assign environment variables
const PORT = parseInt(process.env.PORT || 4000, 10);
const { API_NAME } = process.env || 'API';
const { NODE_ENV } = process.env || 'development';
const API_AUTH = process.env.API_AUTH || 'http://localhost:4001';
const API_CATALOG = process.env.API_CATALOG || 'http://localhost:4010';
const { FALLBACK_LANGUAGE, IPINFO_TOKEN } = process.env;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  // eslint-disable-next-line class-methods-use-this
  willSendRequest({ request, context }) {
    // Set current language
    request.http.headers.set('lng', context.lng || FALLBACK_LANGUAGE);

    // Set location
    if (context.location) {
      request.http.headers.set('location-ip', context.location.ip);
      request.http.headers.set('location-city', context.location.city);
      request.http.headers.set('location-region', context.location.region);
      request.http.headers.set('location-country', context.location.country);
      request.http.headers.set('location-loc', context.location.loc);
      request.http.headers.set('location-lat', context.location.lat);
      request.http.headers.set('location-lng', context.location.lng);
      request.http.headers.set('location-postal', context.location.postal);
      request.http.headers.set('location-timezone', context.location.timezone);
      request.http.headers.set('location-org', context.location.org);
      request.http.headers.set('location-hostname', context.location.hostname);
    }

    // Set request organization and store
    request.http.headers.set('organizationId', context.organizationId);
    request.http.headers.set('storeId', context.storeId);
  }
}

// -----------------------------------------
// Apollo Gateway
// -----------------------------------------
const apolloGateway = new ApolloGateway({
  port: PORT,
  serviceList: [
    { name: 'api-auth', url: `${API_AUTH}/graphql` },
    { name: 'api-catalog', url: `${API_CATALOG}/graphql` }
  ],
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  }
});

// -----------------------------------------
// Apollo Server setup
// -----------------------------------------
const run = async () => {
  // Load APIs
  const { schema, executor } = await apolloGateway.load();

  let user;
  let loc;
  let organizationId;
  let storeId;

  // Setup Apollo Server
  const apolloServer = new ApolloServer({
    schema,
    executor,
    tracing: true,
    subscriptions: false, // There is not subscriptions on Apollo Federation
    engine: false,
    context: async ({ req, res }) => {
      // Get parameters from request headers
      const lng = req.headers.lng || FALLBACK_LANGUAGE;

      user = null;

      // Get request location
      loc = await ipHelper.getLocation(
        req.connection.remoteAddress,
        IPINFO_TOKEN
      );

      // TODO: replace this by jwt decrypted data
      organizationId = '5f29138bcf14e700ac976db7';
      storeId = '5f3cc736121dbd84e68bf753';

      return {
        req,
        res,
        lng,
        organizationId,
        storeId,
        loc: loc || null
      };
    },
    formatError: err => {
      return apolloErrorFormatter(err, user, loc);
    }
  });

  // Apply Express middleware to Apollo
  const app = express();

  // Express middlewares
  app.use(cookieParser());
  app.use(bodyParser.json());

  // i18next setup
  const localesPath = path.join(__dirname, '../../../locales');
  await i18nextSetup(app, localesPath);

  // Setup cors
  const corsOptions = {
    credentials: true
  };
  app.use(cors(corsOptions));

  // Healthcheck
  app.get('/healthcheck', (req, res) => {
    return res.json('ok');
  });

  // Apply Express middleware to Apollo
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen({ port: PORT }, () =>
    logger.info(
      `🚀 ${API_NAME} ready at http://localhost:${PORT}${apolloServer.graphqlPath} on ${NODE_ENV} mode`
    )
  );
};

// ---------------------------------------------------
// START SERVER
// ---------------------------------------------------
try {
  run();
} catch (e) {
  console.error(
    `Error starting ${API_NAME} on ${NODE_ENV} mode`,
    e.message,
    e.stack
  );
}
