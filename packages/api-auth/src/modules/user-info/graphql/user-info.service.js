// Custom libs
const {
  addNewUserInfoSchema,
  updateUserInfoSchema,
  deleteUserInfoSchema
} = require('@ecommerce-sandbox-auth/shared/src/modules/auth/yup/user-info');
const {
  formatYupErrors
} = require('@ecommerce-sandbox-auth/shared/src/common/utils');
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const throwApolloError = require('@ecommerce-sandbox-auth/api-common/src/helpers/throw-apollo-error');

module.exports.validateAddNewUserInfoFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await addNewUserInfoSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INFO_INPUT,
      method,
      'Invalid user-info format',
      input,
      errors
    );
  }
};

module.exports.validateUpdateUserInfoFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await updateUserInfoSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid user-info format',
      input,
      errors
    );
  }
};

module.exports.validateDeleteUserInfoFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await deleteUserInfoSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INFO_INPUT,
      method,
      'Invalid user-info format',
      input,
      errors
    );
  }
};
