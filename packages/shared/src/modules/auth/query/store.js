// Vendor libs
const gql = require('graphql-tag');

const GET_ALL_STORES = gql`
  query {
    getAllStores {
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

const GET_STORE_BY_ID = gql`
  query($id: ID!) {
    getStoreById(id: $id) {
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

const SEARCH_STORES = gql`
  query($filter: String, $page: Int, $limit: Int, $sort: String, $asc: Int) {
    searchStores(
      filter: $filter
      page: $page
      limit: $limit
      sort: $sort
      asc: $asc
    ) {
      docs {
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

module.exports = {
  GET_ALL_STORES,
  GET_STORE_BY_ID,
  SEARCH_STORES
};
