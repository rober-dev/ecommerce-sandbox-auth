// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewCategorySchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    name: Yup.string().required().min(3).max(255),
    slug: Yup.string().max(150),
    parentCategoryId: Yup.string().matches(regexp.objectId).nullable(),
    storeId: Yup.string().required().matches(regexp.objectId)
  });
};

module.exports.updateCategorySchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    name: Yup.string().required().max(255),
    slug: Yup.string().max(150),
    parentCategoryId: Yup.string().matches(regexp.objectId).nullable(),
    storeId: Yup.string().required().matches(regexp.objectId)
  });
};

module.exports.deleteCategorySchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};
