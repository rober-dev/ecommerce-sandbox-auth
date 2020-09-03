// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_CATEGORY_BY_ID = gql`
  query GET_CATEGORY_BY_ID($id: ID!) {
    getCategoryById(id: $id) {
      id
      name
      slug
      storeId
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_CATEGORY_BY_SLUG = gql`
  query GET_CATEGORY_BY_SLUG($slug: String!) {
    getCategoryBySlug(slug: $slug) {
      id
      name
      slug
      storeId
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_ALL_CATEGORIES = gql`
  query GET_ALL_CATEGORIES {
    getAllCategories {
      id
      name
      slug
      storeId
      createdAt
      updatedAt
    }
  }
`;

module.exports.SEARCH_CATEGORIES = gql`
  query SEARCH_CATEGORIES(
    $filter: String
    $page: Int
    $limit: Int
    $sort: String
    $asc: Int
  ) {
    searchCategories(
      filter: $filter
      page: $page
      limit: $limit
      sort: $sort
      asc: $asc
    ) {
      docs {
        id
        name
        slug
        storeId
        createdAt
        updatedAt
      }
      hasNextPage
      hasPrevPage
      page
      limit
      totalDocs
      totalPages
      pagingCounter
    }
  }
`;
