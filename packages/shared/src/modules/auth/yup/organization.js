// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewOrganizationSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    name: Yup.string().required().min(3).max(255)
  });
};

module.exports.updateOrganizationSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    name: Yup.string().required().min(3).max(255)
  });
};

module.exports.deleteOrganizationSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};
