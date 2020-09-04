// Custom libs
const {
  addNewOrganizationSchema,
  updateOrganizationSchema,
  deleteOrganizationSchema
} = require('@ecommerce-sandbox-auth/shared/src/modules/auth/yup/organization');
const {
  formatYupErrors
} = require('@ecommerce-sandbox-auth/shared/src/common/utils');
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const throwApolloError = require('@ecommerce-sandbox-auth/api-common/src/helpers/throw-apollo-error');

module.exports.validateAddNewOrganizationFormat = async (
  lng,
  input,
  method
) => {
  try {
    // Validate input format
    await addNewOrganizationSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid organization format',
      input,
      errors
    );
  }
};

module.exports.validateUpdateOrganizationFormat = async (
  lng,
  input,
  method
) => {
  try {
    // Validate input format
    await updateOrganizationSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid organization format',
      input,
      errors
    );
  }
};

module.exports.validateDeleteOrganizationFormat = async (
  lng,
  input,
  method
) => {
  try {
    // Validate input format
    await deleteOrganizationSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid organization format',
      input,
      errors
    );
  }
};

module.exports.validateRepeatedOrganizationName = async (
  method,
  Organization,
  input,
  t
) => {
  const { name } = input;
  const repeatedName = await Organization.find({ name });

  if (repeatedName && repeatedName.length > 0) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      method,
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:organization'),
        prop: t('name'),
        value: name
      }),
      input
    );
  }
  return null;
};
