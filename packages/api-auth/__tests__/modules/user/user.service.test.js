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

  it('CheckPasswordConfirmation should return true with same passwords', () => {
    const password = 'passwordoriginal';
    const passwordConfirmation = 'passwordoriginal';

    const confirmation = userService.checkPasswordConfirmation(
      t,
      password,
      passwordConfirmation
    );

    expect(confirmation).toBeTruthy();
  });

  it('CheckPasswordConfirmation should throw error with different passwords', () => {
    const password = 'passwordoriginal';
    const passwordConfirmation = 'password';

    expect(() =>
      userService.checkPasswordConfirmation(t, password, passwordConfirmation)
    ).toThrow();
  });

  it('LoginSuccessfully should reset lockUntil, loginAttempts and lastLogin of user', async () => {
    // Insert dummy data
    const data = await testDB.models.User.insertMany(initialUsers);

    const user = data[0];
    const fecha = new Date();
    user.loginAttempts = 4;
    user.lastLogin = fecha;
    user.lockUntil = '3 hours';

    const result = await userService.loginSuccessfully(user);

    expect(result.loginAttempts).toEqual(0);
    expect(result.lockUntil).toBeNull();
    expect(result.lastLogin.getTime()).toBeGreaterThan(fecha.getTime());
  });
});
