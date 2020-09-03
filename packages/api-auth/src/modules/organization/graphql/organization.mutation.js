// Custom libs
const {
  GRAPHQL_ERROR
} = require('@minimal-ecommerce-sandbox/shared/src/common/enums');
const throwApolloError = require('@minimal-ecommerce-sandbox/api-common/src/helpers/throw-apollo-error');

// Logger
const logger = require('@minimal-ecommerce-sandbox/common/src/logger');

const {
  validateAddNewOrganizationFormat,
  validateUpdateOrganizationFormat,
  validateDeleteOrganizationFormat,
  validateRepeatedOrganizationName
} = require('./organization.service');

// Mutations
const addNewOrganization = async (parent, { input }, { lng, models, t }) => {
  // Validate organization format
  await validateAddNewOrganizationFormat(lng, input, 'addNewOrganization');

  const { Organization } = models;
  const { name } = input;

  validateRepeatedOrganizationName('addNewOrganization', Organization, input);

  try {
    const organization = await Organization.create({ name });
    return organization;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'addNewOrganization',
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:organization'),
        prop: t('name'),
        value: name
      }),
      input
    );
  }
};

const updateOrganization = async (parent, { input }, { lng, models, t }) => {
  // validate input format
  await validateUpdateOrganizationFormat(lng, input, 'updateOrganization');

  const { Organization } = models;
  const { id, name } = input;

  validateRepeatedOrganizationName('updateOrganization', Organization, input);

  try {
    const modifiedOrganization = await Organization.findOneAndUpdate(
      { _id: id },
      { name },
      { new: true }
    );
    return modifiedOrganization;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'addNewOrganization',
      t('common:repeatedItemWithProp', {
        a: t('aF'),
        item: t('auth:organization'),
        prop: t('name'),
        value: name
      }),
      input
    );
  }
};

const deleteOrganization = async (parent, { id }, { lng, models }) => {
  // Validate format
  await validateDeleteOrganizationFormat(lng, { id }, 'deleteOrganization');

  try {
    const { Organization } = models;

    const result = await Organization.deleteOne({ _id: id });
    logger.info(result);
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
  addNewOrganization,
  updateOrganization,
  deleteOrganization
};
