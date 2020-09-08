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

// Members
const apiUrl = process.env.API_URL || 'http://localhost:4000';

export default function createApolloClient(
  initialState,
  ctx,
  serverAccessToken
) {
  let lng;
  if (typeof window !== 'undefined') {
    // lng = localStorage.getItem('lng');
    lng = 'es';
  }
  const httpLink = new HttpLink({
    uri: `${apiUrl}/graphql`,
    credentials: 'include',
    fetch,
    headers: {
      lng
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
      fetch(`${apiUrl}/graphql/auth/refresh-token`, {
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
