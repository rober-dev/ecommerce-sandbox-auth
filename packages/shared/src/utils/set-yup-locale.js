// Vendor libs
const { setLocale } = require('yup');

// Custom libs
const path = require('path');
const fs = require('fs');
const loadJson = require('./load-json');

module.exports = lng => {
  // Check lng parameter
  if (!lng) {
    throw new Error('Parameter "lng" not sent on set-locale method');
  }

  // Set locale file path
  const filePath = path.join(__dirname, '../../../../locales', lng, 'yup.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Locale file used in set-locale module not exists in path ${filePath}`
    );
  }

  // Load json file
  const locale = loadJson(filePath);

  // Set locale messages to yup
  setLocale(locale);
};
