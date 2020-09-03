// Vendor libs
const gql = require('graphql-tag');

module.exports.ADD_NEW_PRODUCT = gql`
  mutation ADD_NEW_PRODUCT($input: AddNewProductInput!) {
    addNewProduct(input: $input) {
      id
      name
      slug
      price
      offerPrice
      brandId
      brand {
        id
        slug
        name
      }
      categoryIds
      categories {
        id
        name
        slug
      }
      description
      createdAt
      updatedAt
    }
  }
`;

module.exports.UPDATE_PRODUCT = gql`
  mutation UPDATE_PRODUCT($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      slug
      price
      offerPrice
      brandId
      brand {
        id
        slug
        name
      }
      categoryIds
      categories {
        id
        name
        slug
      }
      description
      createdAt
      updatedAt
    }
  }
`;

module.exports.DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id)
  }
`;
