// Vendor libs
const throwApolloError = require('@ecommerce-sandbox-auth/api-common/src/helpers/throw-apollo-error');
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const {
  validateAddNewStoreFormat,
  validateUpdateStoreFormat,
  validateDeleteStoreFormat,
  validateRepeatedStoreName,
  validateRepeatedStoreDomain
} = require('./store.service');

// Mutations
const addNewStore = async (
  parent,
  { input },
  { organizationId, lng, models, t }
) => {
  // Validate store format
  await validateAddNewStoreFormat(
    lng,
    { ...input, organizationId },
    'addNewStore'
  );

  const { name, domain } = input;
  const { Store } = models;
  const data = { ...input, organizationId, t };

  // Check component name is not repeated in store
  validateRepeatedStoreName('addNew', Store, data, t);
  validateRepeatedStoreDomain('addNew', Store, data, t);

  try {
    // Save item
    const newStore = new Store({
      name,
      domain,
      organizationId
    });

    const result = newStore.save();
    return result;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'addNewStore',
      err.message
    );
  }
};

const updateStore = async (
  parent,
  { input },
  { organizationId, lng, models, t }
) => {
  // Validate store format
  await validateUpdateStoreFormat(lng, input, 'updateStore');

  try {
    const { id, name, domain } = input;
    const { Store } = models;

    const data = { ...input, organizationId, t };

    // Check component name is not repeated in store
    validateRepeatedStoreName('addNew', Store, data, t);
    validateRepeatedStoreDomain('addNew', Store, data, t);

    const modifiedStore = await Store.findOneAndUpdate(
      { _id: id },
      { id, name, domain, organizationId },
      { new: true }
    );

    return modifiedStore;
  } catch (error) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'updateStore',
      error.message
    );
  }
};

const deleteStore = async (parent, { id }, { lng, models }) => {
  // Validate store format
  await validateDeleteStoreFormat(lng, { id }, 'deleteStore');

  try {
    const { Store } = models;

    const result = await Store.deleteOne({ _id: id });
    return result.deletedCount === 1;
  } catch (error) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'deleteStore',
      error.message
    );
  }
};

module.exports = {
  addNewStore,
  updateStore,
  deleteStore
};
