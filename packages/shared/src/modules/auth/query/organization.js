// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_ALL_ORGANIZATIONS = gql`
  query {
    getAllOrganizations {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_ORGANIZATION_BY_ID = gql`
  query($id: ID!) {
    getOrganizationById(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

module.exports.SEARCH_ORGANIZATIONS = gql`
  query($filter: String, $page: Int, $limit: Int, $sort: String, $asc: Int) {
    searchOrganizations(
      filter: $filter
      page: $page
      limit: $limit
      sort: $sort
      asc: $asc
    ) {
      docs {
        id
        name
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
