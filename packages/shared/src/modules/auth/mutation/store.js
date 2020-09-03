// Vendor libs
const gql = require('graphql-tag');

const ADD_NEW_STORE = gql`
  mutation($input: addNewStoreInput!) {
    addNewStore(input: $input) {
      id
      name
      domain
      organizationId
      organization {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_STORE = gql`
  mutation($input: updateStoreInput!) {
    updateStore(input: $input) {
      id
      name
      domain
      organizationId
      organization {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_STORE = gql`
  mutation($id: ID!) {
    deleteStore(id: $id)
  }
`;

module.exports = {
  ADD_NEW_STORE,
  UPDATE_STORE,
  DELETE_STORE
};
