/* eslint-disable react/prop-types */
/* eslint-disable import/named */

// Vendor libs
import React, { useState, useEffect } from 'react';

// Custom libs
import { ApolloProvider } from '@apollo/react-hooks';
import { withApollo } from '../lib/apollo';
import { appWithTranslation } from '../lib/i18n';

// Component definition
const BaseApp = ({ Component, pageProps, apolloClient }) => {
  const [ssrDone, setSsrDone] = useState(true);

  useEffect(() => {
    setSsrDone(true);
  }, []);

  if (!ssrDone) {
    return <div>loading...</div>;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};
// Exportation
export default withApollo({ ssr: true })(appWithTranslation(BaseApp));
