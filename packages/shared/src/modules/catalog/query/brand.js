// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_BRAND_BY_ID = gql`
  query GET_BRAND_BY_ID($id: ID!) {
    getBrandById(id: $id) {
      id
      name
      slug
      organizationId
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_BRAND_BY_SLUG = gql`
  query GET_BRAND_BY_SLUG($slug: String!) {
    getBrandBySlug(slug: $slug) {
      id
      name
      slug
      organizationId
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_ALL_BRANDS = gql`
  query GET_ALL_BRANDS {
    getAllBrands {
      id
      name
      slug
      organizationId
      createdAt
      updatedAt
    }
  }
`;

module.exports.SEARCH_BRANDS = gql`
  query SEARCH_BRANDS(
    $filter: String
    $page: Int
    $limit: Int
    $sort: String
    $asc: Int
  ) {
    searchBrands(
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
        organizationId
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
