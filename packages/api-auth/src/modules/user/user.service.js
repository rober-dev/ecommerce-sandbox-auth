/* eslint-disable no-param-reassign */
// Vendor libs
const moment = require('moment');

// Custom libs
const {
  addNewUserSchema,
  updateUserSchema,
  deleteUserSchema,
  registerUserSchema,
  logInSchema
} = require('@ecommerce-sandbox-auth/shared/src/modules/auth/yup/user');
const {
  formatYupErrors
} = require('@ecommerce-sandbox-auth/shared/src/common/utils');
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const throwApolloError = require('@ecommerce-sandbox-auth/api-common/src/helpers/throw-apollo-error');
const logger = require('@ecommerce-sandbox-auth/common/src/logger');
const encryptHelper = require('../../utils/encrypt-helper');

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

module.exports.validateRegisterUserFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await registerUserSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid register user format',
      input,
      errors
    );
  }
};

module.exports.validateLogInFormat = async (lng, input, method) => {
  try {
    // Validate input format
    await logInSchema(lng).validate(input, { abortEarly: false });
  } catch (err) {
    const errors = formatYupErrors(err);
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      method,
      'Invalid login format',
      input,
      errors
    );
  }
};

// ---------------------------------------------

module.exports.checkRepeatedUserEmail = async (
  { User },
  { organizationId, storeId },
  t,
  email
) => {
  const result = await User.findOne({ organizationId, storeId, email });
  if (result) {
    throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'checkRepeatedUserEmail',
      t('common:repeatedItemWithProp', {
        a: t('aM'),
        item: t('auth:user'),
        prop: t('auth:email'),
        value: email
      }),
      { email, organizationId, storeId }
    );
  }
  return false;
};

module.exports.checkRepeatedUserUsername = async (
  { User },
  { organizationId, storeId },
  t,
  username
) => {
  const result = await User.findOne({ organizationId, storeId, username });
  if (result) {
    throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'checkRepeatedUserUsername',
      t('common:repeatedItemWithProp', {
        a: t('aM'),
        item: t('auth:user'),
        prop: t('auth:username'),
        value: username
      }),
      { username, organizationId, storeId }
    );
  }
  return false;
};

module.exports.checkPasswordConfirmation = (
  t,
  password,
  passwordConfirmation
) => {
  if (password !== passwordConfirmation) {
    throwApolloError(
      GRAPHQL_ERROR.BAD_USER_INPUT,
      'checkPasswordConfirmation',
      t('auth:passwordConfirmationDoesNotMatch'),
      {}
    );
  }
  return true;
};

module.exports.createUser = async (
  { organizationId, storeId, t },
  { User },
  { email, username, password }
) => {
  // Create user instance
  const newUser = new User({
    organizationId,
    storeId,
    email,
    username,
    password
  });

  // Set password data
  const { salt, hash } = encryptHelper.generateHash(password);
  newUser.salt = salt;
  newUser.hash = hash;

  // Rest of default values
  newUser.lastLogin = null;
  newUser.loginAttempts = 0;
  newUser.lockUntil = null;
  newUser.roles = ['USER'];

  try {
    await newUser.save();
    return newUser;
  } catch (err) {
    return throwApolloError(
      GRAPHQL_ERROR.INVALID_OPERATION,
      'createUser',
      t('common:errorSavingEntity'),
      { entity: t('auth:user') }
    );
  }
};

module.exports.comparePassword = (salt, hash, password) => {
  const passwordHashed = encryptHelper.hashPassword(salt, password);
  return passwordHashed === hash;
};

module.exports.addInvalidLoginAttempt = async user => {
  // Add invalida attempt
  let invalidAttempts = user.loginAttempts || 0;
  invalidAttempts += 1;

  // Set user lock until date if invalid attempts reach the limit
  const { MAX_INVALID_LOGIN_ATTEMPTS, USER_LOCK_HOURS } = process.env;
  if (invalidAttempts >= MAX_INVALID_LOGIN_ATTEMPTS) {
    user.lockUntil = moment().add(USER_LOCK_HOURS, 'hours');
    user.invalidAttempts = 0;
  } else {
    user.loginAttempts = invalidAttempts;
  }

  await user.save();
};

module.exports.loginSuccessfully = async user => {
  user.lockUntil = null;
  user.loginAttempts = 0;
  user.lastLogin = new Date();

  return user.save();
};
