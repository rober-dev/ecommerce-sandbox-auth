// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_STOCK_BY_PRODUCT_ID = gql`
  query GET_STOCK_BY_PRODUCT_ID($id: ID!) {
    getStockByProductId(id: $id) {
      id
      productId
      product {
        name
        slug
        price
      }
      min
      current
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_ALL_STOCKS = gql`
  query GET_ALL_STOCKS {
    getAllStocks {
      id
      productId
      product {
        name
        slug
        price
      }
      min
      current
      createdAt
      updatedAt
    }
  }
`;
