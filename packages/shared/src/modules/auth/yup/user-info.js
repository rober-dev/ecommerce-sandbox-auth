// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewUserInfoSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    userId: Yup.string().required().matches(regexp.objectId),
    firstName: Yup.string().required().min(3).max(255),
    lastName: Yup.string().required().min(3).max(255)
  });
};

module.exports.updateUserInfoSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    firstName: Yup.string().required().min(3).max(255)
  });
};

module.exports.deleteUserInfoSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};
