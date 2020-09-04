// Vendor libs
const moment = require('moment');

// Custom libs
const {
  GRAPHQL_ERROR
} = require('@ecommerce-sandbox-auth/shared/src/common/enums');
const throwApolloError = require('@ecommerce-sandbox-auth/api-common/src/helpers/throw-apollo-error');

// Logger
const logger = require('@ecommerce-sandbox-auth/common/src/logger');

const {
  validateAddNewUserFormat,
  validateUpdateUserFormat,
  validateDeleteUserFormat,
  validateRepeatedUserEmail,
  validateRepeatedUserUsername,
  validateRepeatedUserStoreId,
  validateRegisterUserFormat,
  validateLogInFormat,
  checkRepeatedUserEmail,
  checkRepeatedUserUsername,
  checkPasswordConfirmation,
  createUser,
  comparePassword,
  addInvalidLoginAttempt,
  loginSuccessfully
} = require('../user.service');

const {
  createAccessToken,
  createRefreshToken
} = require('../../../utils/token-helper');

// Mutations
module.exports.addNewUser = async (parent, { input }, { lng, models, t }) => {
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

module.exports.updateUser = async (parent, { input }, { lng, models, t }) => {
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

module.exports.deleteUser = async (parent, { id }, { lng, models }) => {
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

module.exports.registerUser = async (
  parent,
  { input },
  { lng, t, models, organizationId, storeId }
) => {
  /* BUSINESS LOGIN:
  -------------------
  1- Validate user data
  2- Check user email is not repeated
  3- Check user username is not repeated
  4- Save user in Database
  5- Generate access and refresh tokens
  6- Return tokens
  */

  // Get parameters
  const { username, email, password, passwordConfirmation } = input;

  // Validate format
  await validateRegisterUserFormat(
    lng,
    { username, email, password, passwordConfirmation },
    'registerUser'
  );

  // Check repeated user email
  await checkRepeatedUserEmail(models, { organizationId, storeId }, t, email);

  // Check repeated user username
  await checkRepeatedUserUsername(
    models,
    { organizationId, storeId },
    t,
    username
  );

  // Check repeated user username
  checkPasswordConfirmation(t, password, passwordConfirmation);

  // Save user
  const user = await createUser({ organizationId, storeId, t }, models, {
    email,
    username,
    password
  });

  // Send registration email
  // TODO: await userService.sendRegistrationEmail();

  // Generate JWTs
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    accessToken,
    refreshToken
  };
};

module.exports.logIn = async (
  parent,
  { input },
  { lng, t, models, organizationId, storeId }
) => {
  /* BUSINESS LOGIN:
  -------------------
  1- Validate user data
  2- Get user by email, organization and store
  3- Check user exists, and it's not locked
  4- Check user password is valid
  5- Save login attempt (success or fail)
  6- Return access token (or error)
  */

  // Get args
  const { email, password, rememberMe } = input;
  const { User } = models;

  // Validate format
  await validateLogInFormat(lng, { email, password, rememberMe }, 'logIn');

  // Get user
  const user = await User.findOne({ organizationId, storeId, email });
  if (!user) {
    return throwApolloError(
      GRAPHQL_ERROR.FORBIDDEN,
      'logIn',
      t('auth:InvalidLoginData')
    );
  }

  // Check user data
  if (user.lockUntil && moment(user.lockUntil) > new Date()) {
    return throwApolloError(
      GRAPHQL_ERROR.FORBIDDEN,
      'logIn',
      t('auth:UserIsTemporarilyLocked', { email })
    );
  }

  // TODO: Check confirmation email

  // Compare password
  const passwordMatch = comparePassword(user.salt, user.hash, password);
  if (!passwordMatch) {
    // Password is INVALID
    addInvalidLoginAttempt(user);

    return throwApolloError(
      GRAPHQL_ERROR.FORBIDDEN,
      'logIn',
      t('auth:InvalidLoginData')
    );
  }

  // Password is VALID
  await loginSuccessfully();

  // Get tokens
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    accessToken,
    refreshToken
  };
};
