// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewUserSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    storeId: Yup.string().required().matches(regexp.objectId),
    email: Yup.string().required().min(3).max(255),
    roles: Yup.array().of(
      Yup.mixed().required().oneOf(['ADMIN', 'MANAGER', 'USER', 'GUEST'])
    )
  });
};

module.exports.updateUserSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    email: Yup.string().required().max(255)
  });
};

module.exports.deleteUserSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};

module.exports.registerUserSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    username: Yup.string().required().min(4).max(255),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(5),
    passwordConfirmation: Yup.string().required().min(5)
  });
};

module.exports.logInSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(5),
    rememberMe: Yup.boolean().required()
  });
};
