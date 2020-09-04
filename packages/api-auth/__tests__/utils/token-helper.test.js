// Custom libs
const tokenHelper = require('../../src/utils/token-helper');
// Enum to test organization and store data
const ENUM_ENTITIES = require('../data/enums');

describe('TokenHelper tests', () => {
  it('createAccessToken should return null with null user', () => {
    const user = null;

    const result = tokenHelper.createAccessToken(user);

    expect(result).toBeNull();
  });

  it('createAccessToken should returns valid jwt with user data', () => {
    const user = {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE,
      userId: 1,
      email: 'hello@world.com',
      username: 'hello-world',
      roles: ['USER']
    };

    process.env.ACCESS_TOKEN_SECRET = 'abc';
    process.env.ACCESS_TOKEN_EXPIRATION = '1d';

    const jwt = tokenHelper.createAccessToken(user);

    // Assertions
    expect(jwt).not.toBeNull();
  });

  it('createRefreshToken should returns valid jwt with user data', () => {
    const user = {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE,
      userId: 1
    };

    process.env.REFRESH_TOKEN_SECRET = 'abc';
    process.env.REFRESH_TOKEN_EXPIRATION = '1d';

    const jwt = tokenHelper.createRefreshToken(user);

    // Assertions
    expect(jwt).not.toBeNull();
  });
});
