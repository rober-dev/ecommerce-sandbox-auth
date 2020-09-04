const {
  addNewStoreSchema,
  updateStoreSchema,
  deleteStoreSchema
} = require('@ecommerce-sandbox-auth/shared/src/modules/auth/yup/store');
const {
  formatYupErrors
} = require('@ecommerce-sandbox-auth/shared/src/common/utils');
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const throwApolloError = require('@ecommerce-sandbox-auth/api-common/src/helpers/throw-apollo-error');

const validateAddNewStoreFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await addNewStoreSchema(lng).validate(input, { abortEarly: false });
  } catch (error) {
    const errors = formatYupErrors(error);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid store format',
      input,
      errors
    );
  }
};

const validateUpdateStoreFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await updateStoreSchema(lng).validate(input, { abortEarly: false });
  } catch (error) {
    const errors = formatYupErrors(error);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid store format',
      input,
      errors
    );
  }
};

const validateDeleteStoreFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await deleteStoreSchema(lng).validate(input, { abortEarly: false });
  } catch (error) {
    const errors = formatYupErrors(error);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid store format',
      input,
      errors
    );
  }
};

const validateRepeatedStoreName = async (method, Component, data, t) => {
  const { name, organizationId } = data;

  const repeatedName = await Component.find({ name, organizationId });

  if (repeatedName && repeatedName.lenght > 0) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      method,
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:store'),
        prop: t('name'),
        value: name
      }),
      data
    );
  }
  return null;
};

const validateRepeatedStoreDomain = async (method, Component, data, t) => {
  const { domain, organizationId } = data;

  const repeatedDomain = await Component.find({ domain, organizationId });

  if (repeatedDomain && repeatedDomain.lenght > 0) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      method,
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:store'),
        prop: t('domain'),
        value: domain
      }),
      data
    );
  }
  return null;
};

module.exports = {
  validateAddNewStoreFormat,
  validateDeleteStoreFormat,
  validateUpdateStoreFormat,
  validateRepeatedStoreName,
  validateRepeatedStoreDomain
};
