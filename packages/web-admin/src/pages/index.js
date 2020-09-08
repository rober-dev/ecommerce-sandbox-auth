// Vendor libs
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Component definition
const HomePage = () => {
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
      <h1>Home page</h1>
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

// Exportation
export default HomePage;
