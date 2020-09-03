// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_ALL_USERS_INFO = gql`
  query {
    getAllUsersInfo {
      id
      userId
      user {
        id
        email
      }
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_USER_INFO_BY_ID = gql`
  query($id: ID!) {
    getUserInfoById(id: $id) {
      id
      userId
      user {
        id
        email
      }
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

module.exports.SEARCH_USERS_INFO = gql`
  query($filter: String, $page: Int, $limit: Int, $sort: String, $asc: Int) {
    searchUsersInfo(
      filter: $filter
      page: $page
      limit: $limit
      sort: $sort
      asc: $asc
    ) {
      docs {
        id
        userId
        user {
          id
          email
        }
        firstName
        lastName
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
