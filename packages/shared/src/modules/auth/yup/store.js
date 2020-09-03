// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

const addNewStoreSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    name: Yup.string().required().min(3).max(255),
    domain: Yup.string().required().min(5).max(255),
    organizationId: Yup.string().required().matches(regexp.objectId)
  });
};

const updateStoreSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    name: Yup.string().required().min(3).max(255),
    domain: Yup.string().required().min(5).max(255),
    organizationId: Yup.string().required().matches(regexp.objectId)
  });
};

const deleteStoreSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};

module.exports = {
  addNewStoreSchema,
  updateStoreSchema,
  deleteStoreSchema
};
