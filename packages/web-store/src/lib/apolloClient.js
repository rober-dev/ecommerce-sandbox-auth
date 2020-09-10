// Vendor libs
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

// Custom libs
import { getAccessToken, setAccessToken } from './access-tokens';

// Environment variables (loaded later in node mode)
let API_URL;
let ORGANIZATION_ID;
let STORE_ID;
let lng;

export default function createApolloClient(
  initialState,
  ctx,
  serverAccessToken
) {
  // Get environment variables in Node mode
  if (typeof window === 'undefined') {
    API_URL = process.env.API_URL;
    ORGANIZATION_ID = process.env.ORGANIZATION_ID;
    STORE_ID = process.env.STORE_ID;
  } else {
    lng = 'es';
  }

  const httpLink = new HttpLink({
    uri: `${API_URL}/graphql`,
    credentials: 'include',
    fetch,
    headers: {
      lng,
      'organization-id': ORGANIZATION_ID,
      'store-id': STORE_ID
    }
  });

  const authLink = setContext((_req, { headers }) => {
    let token = null;
    if (typeof window === 'undefined') {
      token = serverAccessToken;
      // console.log('token from server', token);
    } else {
      token = getAccessToken();
      // console.log('token from client', token);
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : ''
      }
    };
  });

  const refreshLink = new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();
      if (!token) return true;
      try {
        const { exp } = jwtDecode(token);
        return !(Date.now() >= exp * 1000);
      } catch (err) {
        return false;
      }
    },
    fetchAccessToken: () =>
      fetch(`${API_URL}/graphql/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include'
      }),
    handleFetch: accessToken => setAccessToken(accessToken),
    handleError: err => console.log('refresh error', err.message)
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log(graphQLErrors, networkError);
  });

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
    cache: new InMemoryCache().restore(initialState)
  });
}
