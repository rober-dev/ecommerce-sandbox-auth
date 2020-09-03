// Vendor libs
const gql = require('graphql-tag');

module.exports.ADD_NEW_BRAND = gql`
  mutation ADD_NEW_BRAND($input: AddNewBrandInput!) {
    addNewBrand(input: $input) {
      id
      name
      slug
      organizationId
      createdAt
      updatedAt
    }
  }
`;

module.exports.UPDATE_BRAND = gql`
  mutation UPDATE_BRAND($input: UpdateBrandInput!) {
    updateBrand(input: $input) {
      id
      name
      slug
      organizationId
      createdAt
      updatedAt
    }
  }
`;

module.exports.DELETE_BRAND = gql`
  mutation DELETE_BRAND($id: ID!) {
    deleteBrand(id: $id)
  }
`;
