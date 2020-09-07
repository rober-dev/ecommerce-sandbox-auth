// Vendor libs
const _ = require('lodash');
const path = require('path');

// Custom libs
const {
  parseJSONFile
} = require('@ecommerce-sandbox-auth/api-common/src/helpers/file-helper');
const testDB = require('../../_utils/db-test');

// Enum to test organization and store data
const ENUM_ENTITIES = require('../../data/enums');

// Load initial data
const filePathUsers = path.join(__dirname, '../../data/users.json');
const initialUsers = parseJSONFile(filePathUsers);

const userService = require('../../../src/modules/user/user.service');

describe('UserService methods', () => {
  // Common test methods
  beforeAll(testDB.connectToDB);
  afterAll(testDB.disconnectDB);
  afterEach(testDB.cleanDB);

  // Base context for all requests
  const t = jest.fn(() => 'Translated string');

  it('CheckRepeatedUserEmail throws exception with repeated email', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE
    });

    const fn = userService.checkRepeatedUserEmail(
      { ...testDB.models },
      {
        organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
        storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE
      },
      t,
      repeatedUser.email
    );

    await expect(fn).rejects.toThrow();
  });

  it('CheckRepeatedUserEmail return false with inexistent email', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE
    });

    const result = await userService.checkRepeatedUserEmail(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.email}2`
    );

    expect(result).toBeFalsy();
  });

  it('CheckRepeatedUserEmail is valid with same email in other store', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_SALES
    });

    const result = await userService.checkRepeatedUserEmail(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.email}2`
    );

    expect(result).toBeFalsy();
  });

  it('CheckRepeatedUserEmail is valid with same email in other organization', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_HM,
      storeId: ENUM_ENTITIES.STORE_HM
    });

    const result = await userService.checkRepeatedUserEmail(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.email}2`
    );

    expect(result).toBeFalsy();
  });

  it('CheckRepeatedUserEmail return false with same email and other organization', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);
    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE
    });

    const result = await userService.checkRepeatedUserEmail(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.email}2`
    );

    expect(result).toBeFalsy();
  });

  it('CheckRepeatedUserUsername throws exception with repeated username', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);
    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE
    });

    const fn = userService.checkRepeatedUserUsername(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      repeatedUser.username
    );

    await expect(fn).rejects.toThrow();
  });

  it('CheckRepeatedUserUsername return false with inexistent username', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);
    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_ONLINE
    });

    const result = await userService.checkRepeatedUserUsername(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.username}2`
    );

    expect(result).toBeFalsy();
  });

  it('CheckRepeatedUserUsername return false with same email and other store', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_KRACK,
      storeId: ENUM_ENTITIES.STORE_KRACK_SALES
    });

    const result = await userService.checkRepeatedUserUsername(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.email}2`
    );

    expect(result).toBeFalsy();
  });

  it('CheckRepeatedUserUsername return false with same email and other organization', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const repeatedUser = _.find(initialUsers, {
      organizationId: ENUM_ENTITIES.ORGANIZATION_HM,
      storeId: ENUM_ENTITIES.STORE_HM
    });

    const result = await userService.checkRepeatedUserUsername(
      { ...testDB.models },
      {
        organizationId: repeatedUser.organizationId,
        storeId: repeatedUser.storeId
      },
      t,
      `${repeatedUser.email}2`
    );

    expect(result).toBeFalsy();
  });

  it('CreateUser should returns saved user', async () => {
    const email = 'hello@world.com';
    const username = 'hello-world';
    const password = '123Abc';
    const organizationId = ENUM_ENTITIES.ORGANIZATION_KRACK;
    const storeId = ENUM_ENTITIES.STORE_KRACK_SALES;

    const savedUser = await userService.createUser(
      {
        organizationId,
        storeId,
        t
      },
      {
        ...testDB.models
      },
      {
        email,
        username,
        password
      }
    );

    expect(savedUser).not.toBeNull();
    expect(savedUser.id).not.toBeNull();
    expect(savedUser.email).toEqual(email);
    expect(savedUser.username).toEqual(username);
    expect(savedUser.organizationId.toString()).toEqual(organizationId);
    expect(savedUser.storeId.toString()).toEqual(storeId);
    expect(savedUser.salt).not.toBeNull();
    expect(savedUser.hash).not.toBeNull();
  });

  it('ComparePassword should returns true', async () => {
    const { salt, hash } = initialUsers[0];
    const password = '123ABC';
    const comparedPassword = userService.comparePassword(salt, hash, password);

    expect(comparedPassword).toBeFalsy();
  });

  it('ComparePassword should returns false', async () => {
    const { salt, hash } = initialUsers[0];
    const password = '12345';
    const comparedPassword = userService.comparePassword(salt, hash, password);

    expect(comparedPassword).toBeFalsy();
  });

  it('AddInvalidLoginAttepmt should add a logginAttempt', async () => {
    // Insert dummy data
    await testDB.models.User.insertMany(initialUsers);

    const { _id } = initialUsers[0];

    const user = await testDB.models.User.findById(_id);
    const initialLoginAttemps = user.loginAttempts;

    await userService.addInvalidLoginAttempt(user);

    const modifiedUser = await testDB.models.User.findById(_id);

    expect(user.loginAttempts).not.toEqual(initialLoginAttemps);
    expect(modifiedUser.loginAttempts).not.toEqual(initialLoginAttemps);
  });
});
