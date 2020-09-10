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
const logger = require('@ecommerce-sandbox-auth/common/src/logger');
const ipHelper = require('@ecommerce-sandbox-auth/common/src/helpers/ip-helper');
const i18nextSetup = require('@ecommerce-sandbox-auth/api-common/src/i18n/i18next-setup');

// Helpers
const apolloErrorFormatter = require('../helpers/apollo-error-formatter');

// Custom routes
const authRoutes = require('./routes/auth.routes');

// Load environment variables
dotenv.config();

// Assign environment variables
const PORT = parseInt(process.env.PORT || 4000, 10);
const { API_NAME } = process.env || 'API';
const { NODE_ENV } = process.env || 'development';
const WEB_PWA = process.env.WEB_PWA || 'http://localhost:3000';
const WEB_ADMIN = process.env.WEB_ADMIN || 'http://localhost:3001';
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

    // Set current user
    request.http.headers.set('user-id', context.userId);
    request.http.headers.set('user-email', context.userEmail);
    request.http.headers.set('user-username', context.userName);
    request.http.headers.set('user-roles', context.userRoles);

    // Set request organization and store
    request.http.headers.set('organization-id', context.organizationId);
    request.http.headers.set('store-id', context.storeId);
    request.http.headers.set('request-mode', context.storeId);
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

  // User data
  let user;
  let userId;
  let userEmail;
  let userName;
  let userRoles;

  // Location info
  let loc;

  // Request source
  let requestMode;
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

      // Get request location
      loc = await ipHelper.getLocation(
        req.connection.remoteAddress,
        IPINFO_TOKEN
      );

      // Get organizationId and StoreId from Headers (WebStore) or JWT(Admin)
      if (req.headers['organization-id'] && req.headers['store-id']) {
        // Web Store
        requestMode = 'store';
        organizationId = req.headers['organization-id'];
        storeId = req.headers['store-id'];
      } else {
        // Admin
        requestMode = 'admin';
      }

      return {
        req,
        res,
        // Language
        lng,
        // Origin
        organizationId,
        storeId,
        requestMode,
        // Location data
        loc: loc || null,
        // User data
        userId,
        userEmail,
        userName,
        userRoles
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
    credentials: true,
    origin: [WEB_PWA, WEB_ADMIN]
  };
  app.use(cors(corsOptions));

  // Healthcheck
  app.get('/healthcheck', (req, res) => {
    return res.json('ok');
  });

  app.post('/auth/refresh-token', authRoutes.refreshTokenHandler);

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
