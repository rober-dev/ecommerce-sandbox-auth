// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_ALL_BRANDS = gql`
  query GET_ALL_BRANDS {
    getAllBrands {
      id
      name
    }
  }
`;
