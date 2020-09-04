// Vendor libs
const CryptoJS = require('crypto-js');

module.exports.generateHash = password => {
  // Generate salt and password hashed
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iteractions: 1000
  });

  return { salt, hash };
};

module.exports.hashPassword = (salt, password) => {
  // Generate salt and password hashed
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iteractions: 1000
  });

  return hash;
};
