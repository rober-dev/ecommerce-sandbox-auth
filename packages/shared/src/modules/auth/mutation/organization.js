// Vendor libs
const gql = require('graphql-tag');

module.exports.ADD_NEW_ORGANIZATION = gql`
  mutation ADD_NEW_ORGANIZATION($input: AddNewOrganizationInput!) {
    addNewOrganization(input: $input) {
      id
      name
    }
  }
`;

module.exports.UPDATE_ORGANIZATION = gql`
  mutation UPDATE_ORGANIZATION($input: UpdateOrganizationInput!) {
    updateOrganization(input: $input) {
      id
      name
    }
  }
`;

module.exports.DELETE_ORGANIZATION = gql`
  mutation DELETE_ORGANIZATION($id: ID!) {
    deleteOrganization(id: $id)
  }
`;
