// Vendor libs
const Yup = require('yup');

// Custom libs
const { regexp } = require('../../../common');
const setLocale = require('../../../utils/set-yup-locale');

module.exports.addNewProductSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    name: Yup.string().required().min(3).max(255),
    slug: Yup.string().max(150),
    price: Yup.number().positive(),
    offerPrice: Yup.number().positive(),
    brandId: Yup.string().matches(regexp.objectId),
    categoryIds: Yup.array().of(
      Yup.object().shape({
        categoryId: Yup.string().matches(regexp.objectId),
        organizationId: Yup.string().matches(regexp.objectId),
        storeId: Yup.string().matches(regexp.objectId)
      })
    ),
    description: Yup.string().max(5000)
  });
};

module.exports.updateProductSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId),
    name: Yup.string().required().min(3).max(255),
    slug: Yup.string().max(150),
    price: Yup.number().positive(),
    offerPrice: Yup.number().positive(),
    brandId: Yup.string().matches(regexp.objectId),
    categoryIds: Yup.array().of(
      Yup.object().shape({
        categoryId: Yup.string().matches(regexp.objectId),
        organizationId: Yup.string().matches(regexp.objectId),
        storeId: Yup.string().matches(regexp.objectId)
      })
    ),
    description: Yup.string().max(5000)
  });
};

module.exports.deleteProductSchema = lng => {
  // Set yup locales
  setLocale(lng);

  return Yup.object().shape({
    id: Yup.string().required().matches(regexp.objectId)
  });
};
