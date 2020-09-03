// Vendor libs
const gql = require('graphql-tag');

module.exports.ADD_NEW_USER = gql`
  mutation ADD_NEW_USER($input: AddNewUserInput!) {
    addNewUser(input: $input) {
      id
      storeId
      store {
        id
        name
      }
      email
      lastLogin
      roles
      createdAt
      updatedAt
    }
  }
`;

module.exports.UPDATE_USER = gql`
  mutation UPDATE_USER($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      storeId
      store {
        id
        name
      }
      email
      lastLogin
      roles
      createdAt
      updatedAt
    }
  }
`;

module.exports.DELETE_USER = gql`
  mutation DELETE_USER($id: ID!) {
    deleteUser(id: $id)
  }
`;
