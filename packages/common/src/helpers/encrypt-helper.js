// Vendor libs
const CryptoJS = require('crypto-js');

module.exports.encryptText = (text, PASSPHRASE) => {
  const result = CryptoJS.AES.encrypt(text, PASSPHRASE, {
    keySize: 512 / 32,
    iv: PASSPHRASE,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();

  // Encode crypted data to can use as querystring parameter
  return encodeURIComponent(result);
};

module.exports.decryptText = (text, PASSPHRASE) => {
  // Decode data, could be passed as querystring parameter
  const decodedData = decodeURIComponent(text);
  return CryptoJS.enc.Utf8.stringify(
    CryptoJS.AES.decrypt(decodedData, PASSPHRASE, {
      keySize: 512 / 32,
      iv: PASSPHRASE,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  );
};
