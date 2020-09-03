// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewBrandSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    name: Yup.string().required().min(3).max(255),
    slug: Yup.string().max(150)
  });
};

module.exports.updateBrandSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    name: Yup.string().required().max(255),
    slug: Yup.string().max(150)
  });
};

module.exports.deleteBrandSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};
