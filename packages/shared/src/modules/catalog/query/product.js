// Vendor libs
const gql = require('graphql-tag');

module.exports.GET_PRODUCT_BY_ID = gql`
  query GET_PRODUCT_BY_ID($id: ID!) {
    getProductById(id: $id) {
      id
      name
      slug
      price
      offerPrice
      brandId
      brand {
        id
        slug
        name
      }
      categoryIds
      categories {
        id
        name
        slug
      }
      description
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_PRODUCT_BY_SLUG = gql`
  query GET_PRODUCT_BY_SLUG($slug: String!) {
    getProductBySlug(slug: $slug) {
      id
      name
      slug
      price
      offerPrice
      brandId
      brand {
        id
        slug
        name
      }
      categoryIds
      categories {
        id
        name
        slug
      }
      description
      createdAt
      updatedAt
    }
  }
`;

module.exports.GET_ALL_PRODUCTS = gql`
  query GET_ALL_PRODUCTS {
    getAllProducts {
      id
      name
      slug
      price
      offerPrice
      brandId
      brand {
        id
        slug
        name
      }
      categoryIds
      categories {
        id
        name
        slug
      }
      description
      createdAt
      updatedAt
    }
  }
`;

module.exports.SEARCH_PRODUCTS = gql`
  query SEARCH_PRODUCTS(
    $filter: String
    $page: Int
    $limit: Int
    $sort: String
    $asc: Int
  ) {
    searchProducts(
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
        price
        offerPrice
        brandId
        brand {
          id
          slug
          name
        }
        categoryIds
        categories {
          id
          name
          slug
        }
        description
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
