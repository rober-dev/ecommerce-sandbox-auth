// Vendor libs
const gql = require('graphql-tag');

module.exports.ADD_NEW_STOCK = gql`
  mutation ADD_NEW_STOCK($input: AddNewStockInput!) {
    addNewStock(input: $input) {
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

module.exports.UPDATE_STOCK = gql`
  mutation UPDATE_STOCK($input: UpdateStockInput!) {
    updateStock(input: $input) {
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

module.exports.DELETE_STOCK = gql`
  mutation DELETE_STOCK($id: ID!) {
    deleteStock(id: $id)
  }
`;
