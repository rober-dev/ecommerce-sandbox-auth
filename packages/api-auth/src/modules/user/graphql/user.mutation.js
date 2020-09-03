// Custom libs
const {
  GRAPHQL_ERROR
} = require('@minimal-ecommerce-sandbox/shared/src/common/enums');
const throwApolloError = require('@minimal-ecommerce-sandbox/api-common/src/helpers/throw-apollo-error');

// Logger
const logger = require('@minimal-ecommerce-sandbox/common/src/logger');

const {
  validateAddNewUserFormat,
  validateUpdateUserFormat,
  validateDeleteUserFormat,
  validateRepeatedUserEmail,
  validateRepeatedUserUsername,
  validateRepeatedUserStoreId
} = require('./user.service');

// Mutations
const addNewUser = async (parent, { input }, { lng, models, t }) => {
  // Validate user format
  await validateAddNewUserFormat(lng, input, 'addNewUser');

  const { User } = models;
  const { storeId, email, username, salt, hash, roles } = input;

  validateRepeatedUserEmail('addNewUser', User, input);
  validateRepeatedUserUsername('addNewUser', User, input);
  validateRepeatedUserStoreId('addNewUser', User, input);

  try {
    const user = await User.create({
      storeId,
      email,
      username,
      salt,
      hash,
      roles
    });

    return user;
  } catch (err) {
    logger.error('Error adding a new user: ', err);
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'addNewUser',
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:user')
      }),
      input
    );
  }
};

const updateUser = async (parent, { input }, { lng, models, t }) => {
  // Validate format
  await validateUpdateUserFormat(lng, input, 'updateUser');

  const { id, storeId, email, username, salt, hash, roles } = input;
  const { User } = models;

  validateRepeatedUserEmail('updateUser', User, input);
  validateRepeatedUserUsername('updateUser', User, input);
  validateRepeatedUserStoreId('updateUser', User, input);

  try {
    const modifiedUser = await User.findOneAndUpdate(
      { _id: id },
      { storeId, email, username, salt, hash, roles },
      { new: true }
    );
    return modifiedUser;
  } catch (err) {
    logger.error(`Error updating user: ${err}`);
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'addNewUser',
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:user')
      }),
      input
    );
  }
};

const deleteUser = async (parent, { id }, { lng, models }) => {
  // Validate format
  await validateDeleteUserFormat(lng, { id }, 'deleteUser');

  try {
    const { User } = models;

    const result = await User.deleteOne({ _id: id });
    return result.deletedCount === 1;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'updateOrganization',
      err.message
    );
  }
};

module.exports = {
  addNewUser,
  updateUser,
  deleteUser
};
