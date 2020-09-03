// Vendor libs
const gql = require('graphql-tag');

module.exports.ADD_NEW_CATEGORY = gql`
  mutation ADD_NEW_CATEGORY($input: AddNewCategoryInput!) {
    addNewCategory(input: $input) {
      id
      name
      slug
      storeId
      createdAt
      updatedAt
    }
  }
`;

module.exports.UPDATE_CATEGORY = gql`
  mutation UPDATE_CATEGORY($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
      slug
      storeId
      createdAt
      updatedAt
    }
  }
`;

module.exports.DELETE_CATEGORY = gql`
  mutation DELETE_CATEGORY($id: ID!) {
    deleteCategory(id: $id)
  }
`;
