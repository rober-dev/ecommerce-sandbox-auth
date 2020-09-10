// Vendor libs
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

// Custom libs
import { withTranslation } from '../lib/i18n';

// Component definition
const HomePage = ({ t }) => {
  // GraphQL Query
  const GET_ALL_BRANDS = gql`
    query GET_ALL_BRANDS {
      getAllBrands {
        id
        name
      }
    }
  `;

  // Fetch data
  const { data } = useQuery(GET_ALL_BRANDS);

  return (
    <div>
      <h1>{t('hello')}</h1>
      <div>{`ORGANIZATION_ID from process.env: ${process.env.ORGANIZATION_ID}`}</div>
      {data && data.getAllBrands && (
        <ul>
          {data.getAllBrands.map(brand => (
            <li key={brand.id}>{brand.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Initial props
HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common']
});

HomePage.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(HomePage);
