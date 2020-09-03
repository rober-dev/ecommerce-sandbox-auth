// Vendor libs
const throwApolloError = require('@minimal-ecommerce-sandbox/api-common/src/helpers/throw-apollo-error');
const {
  GRAPHQL_ERROR
} = require('@minimal-ecommerce-sandbox/shared/src/common/enums');

const getAllStores = async (parent, args, ctx) => {
  try {
    const { Store } = ctx.models;

    const result = await Store.find();
    return result;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'getAllStores',
      err.message
    );
  }
};

const getStoreById = async (parent, { id }, ctx) => {
  try {
    const { Store } = ctx.models;

    const result = await Store.findById(id);
    return result;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'getStoreById',
      err.message
    );
  }
};

const searchStores = async (
  parent,
  { filter, page, limit, sort, asc },
  ctx
) => {
  try {
    const { Store } = ctx.models;

    const query = {};

    // Set filters
    if (filter) {
      query.name = new RegExp(filter, 'i');
    }

    let sortOptions = {};

    if (!sort) {
      sortOptions = {
        position: 1
      };
    } else {
      sortOptions[sort] = asc === 1 ? 'asc' : 'desc';
    }

    // Set pagination options
    const options = {
      page: parseInt(page || 1, 10),
      limit: parseInt(limit || 10, 10),
      sort: sortOptions
    };

    const result = await Store.paginate(query, options);

    return result;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'searchStores',
      err.message
    );
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  searchStores
};
