// Vendor libs
const { ApolloError } = require('apollo-server-express');

// Logger
const logger = require('@ecommerce-sandbox-auth/common/src/logger');

const {
  validateUpdateUserInfoFormat,
  validateAddNewUserInfoFormat,
  validateDeleteUserInfoFormat
} = require('./user-info.service');

// Mutations
const addNewUserInfo = async (parent, { input }, { lng, models }) => {
  // Validate user format
  await validateAddNewUserInfoFormat(lng, input, 'addNewUserInfo');

  try {
    const { userId, firstName, lastName } = input;
    const { UserInfo } = models;

    const newUserInfo = new UserInfo({
      userId,
      firstName,
      lastName
    });

    const result = await newUserInfo.save();
    return result;
  } catch (err) {
    logger.error('Error adding a new user-info: ', err);
    return null;
  }
};

const updateUserInfo = async (parent, { input }, { lng, models }) => {
  // Validate format
  await validateUpdateUserInfoFormat(lng, input, 'updateUserInfo');

  try {
    const { id, userId, firstName, lastName } = input;
    const { UserInfo } = models;

    const modifiedUserInfo = await UserInfo.findOneAndUpdate(
      { _id: id },
      { userId, firstName, lastName },
      { new: true }
    );
    return modifiedUserInfo;
  } catch (err) {
    logger.error(`Error updating user-info: ${err}`);
    return new ApolloError(`Error updating user-info: ${err}`);
  }
};

const deleteUserInfo = async (parent, { id }, { lng, models }) => {
  // Validate format
  await validateDeleteUserInfoFormat(lng, { id }, 'deleteUserInfo');

  try {
    const { UserInfo } = models;

    const result = await UserInfo.deleteOne({ _id: id });
    return result.deletedCount === 1;
  } catch (err) {
    logger.error(`Error deleting user'info: ${err}`);
    throw new ApolloError(`Error deleting user'info: ${err}`);
  }
};

module.exports = {
  addNewUserInfo,
  updateUserInfo,
  deleteUserInfo
};
