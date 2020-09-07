// Vendor libs
import React from 'react';
import PropTypes from 'prop-types';

// Material-UI libs
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// Custom libs
import { GET_ALL_BRANDS } from '@ecommerce-sandbox-auth/shared/src/modules/catalog/query/brand';
import { initializeApollo } from '../lib/apollo-client';

// GraphQL queries

// Component definition
const HomePage = ({ brands }) => {
  return (
    <Container maxWidth='sm'>
      <Box my={4}>
        <Typography variant='h4' component='h1' gutterBottom>
          Next.js example
        </Typography>
        {brands && brands.length && (
          <ul>
            {brands.map(brand => (
              <li key={brand.id}>{brand.name}</li>
            ))}
          </ul>
        )}
      </Box>
    </Container>
  );
};

// InitialProps
export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const result = await apolloClient.query({
    query: GET_ALL_BRANDS
  });
  return {
    props: {
      brands: result.data.getAllBrands
    },
    revalidate: 1
  };
}

// Page prop-types
HomePage.propTypes = {
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.isRequired,
      name: PropTypes.isRequired
    })
  )
};

export default HomePage;
