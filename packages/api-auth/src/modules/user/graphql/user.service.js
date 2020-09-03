// Custom libs
const {
  addNewUserSchema,
  updateUserSchema,
  deleteUserSchema
} = require('@minimal-ecommerce-sandbox/shared/src/modules/auth/yup/user');
const {
  formatYupErrors
} = require('@minimal-ecommerce-sandbox/shared/src/common/utils');
const {
  GRAPHQL_ERROR
} = require('@minimal-ecommerce-sandbox/shared/src/common/enums');
const throwApolloError = require('@minimal-ecommerce-sandbox/api-common/src/helpers/throw-apollo-error');
const logger = require('@minimal-ecommerce-sandbox/common/src/logger');

module.exports.validateAddNewUserFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await addNewUserSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid user format',
      input,
      errors
    );
  }
};

module.exports.validateUpdateUserFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await updateUserSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid user format',
      input,
      errors
    );
  }
};

module.exports.validateDeleteUserFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await deleteUserSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid user format',
      input,
      errors
    );
  }
};

module.exports.validateRepeatedUserEmail = async (method, User, input) => {
  const { email } = input;
  const repeatedEmail = await User.find({ email });

  if (repeatedEmail && repeatedEmail.length > 0) {
    logger.error('Tried to update a Organization with repeated email');
  }
  return null;
};

module.exports.validateRepeatedUserUsername = async (method, User, input) => {
  const { username } = input;
  const repeatedUsername = await User.find({ username });

  if (repeatedUsername && repeatedUsername.length > 0) {
    logger.error('Tried to update a Organization with repeated username');
  }
  return null;
};

module.exports.validateRepeatedUserStoreId = async (method, User, input) => {
  const { storeId } = input;
  const repeatedStoreId = await User.find({ storeId });

  if (repeatedStoreId && repeatedStoreId.length > 0) {
    logger.error('Tried to update a Organization with repeated storeId');
  }
  return null;
};
