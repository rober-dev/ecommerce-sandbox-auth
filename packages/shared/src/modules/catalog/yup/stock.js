// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewStockSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    productId: Yup.string().required().matches(regexp.objectId),
    min: Yup.number().required().positive(),
    current: Yup.number().required().positive()
  });
};

module.exports.updateStockSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    productId: Yup.string().required().matches(regexp.objectId),
    min: Yup.number().required().positive(),
    current: Yup.number().required().positive()
  });
};

module.exports.deleteStockSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};
