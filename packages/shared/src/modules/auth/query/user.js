// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      storeId
      store {
        id
        name
      }
      email
      salt
      hash
      roles
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_USER_BY_ID = gql`
  query($id: ID!) {
    getUserById(id: $id) {
      id
      storeId
      store {
        id
        name
      }
      email
      salt
      hash
      roles
      createdAt
      updatedAt
    }
  }
`;

module.exports.SEARCH_USERS = gql`
  query($filter: String, $page: Int, $limit: Int, $sort: String, $asc: Int) {
    searchUsers(
      filter: $filter
      page: $page
      limit: $limit
      sort: $sort
      asc: $asc
    ) {
      docs {
        id
        storeId
        store {
          id
          name
        }
        email
        salt
        hash
        roles
        createdAt
        updatedAt
      }
      hasNextPage
      hasPrevPage
      limit
      nextPage
      page
      pagingCounter
      prevPage
      totalDocs
      totalPages
    }
  }
`;
