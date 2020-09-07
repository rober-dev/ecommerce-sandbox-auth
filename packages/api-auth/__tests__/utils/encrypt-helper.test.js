// Vendor libs
const CryptoJS = require('crypto-js');

// Custom libs
const encryptHelper = require('../../src/utils/encrypt-helper');

describe('EncryptHelper tests', () => {
  it('GenerateHash returns valid data', () => {
    const p = '123Abc';
    const { salt, hash } = encryptHelper.generateHash(p);

    const passwordHashed = CryptoJS.PBKDF2(p, salt, {
      keySize: 512 / 32,
      iteractions: 1000
    });

    expect(salt).not.toBeNull();
    expect(hash).not.toBeNull();
    expect(hash.toString()).toEqual(passwordHashed.toString());
  });

  it('HashPassword return valid data', () => {
    const p = '123Abc';
    const salt = '123456';

    const hash = encryptHelper.hashPassword(salt, p);

    const passwordHashed = CryptoJS.PBKDF2(p, salt, {
      keySize: 512 / 32,
      iteractions: 1000
    });

    expect(hash).not.toBeNull();
    expect(hash.toString()).toEqual(passwordHashed.toString());
  });
});
