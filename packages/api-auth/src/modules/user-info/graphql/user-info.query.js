// Vendor libs
const logger = require('@ecommerce-sandbox-auth/common/src/logger');

const getAllUsersInfo = async (parent, args, ctx) => {
  try {
    const { UserInfo } = ctx.models;

    const result = await UserInfo.find();

    return result;
  } catch (err) {
    console.error('Error getting all users-info. ', err);
    return [];
  }
};

const getUserInfoById = async (parent, { id: userInfoId }, ctx) => {
  try {
    const { UserInfo } = ctx.models;

    const result = await UserInfo.findById(userInfoId);

    return result;
  } catch (err) {
    console.error('Error getting User-info by id', err);
    return null;
  }
};

const searchUsersInfo = async (
  parent,
  { filter, page, limit, sort, asc },
  ctx
) => {
  try {
    const { UserInfo } = ctx.models;

    const query = {};

    // Set filters
    if (filter) {
      query.name = new RegExp(filter, 'i');
    }

    let sortOptions = {};

    if (!sort) {
      sortOptions = {
        position: 1
      };
    } else {
      sortOptions[sort] = asc === 1 ? 'asc' : 'desc';
    }

    // Set pagination options
    const options = {
      page: parseInt(page || 1, 10),
      limit: parseInt(limit || 10, 10),
      sort: sortOptions
    };

    const result = await UserInfo.paginate(query, options);

    return result;
  } catch (err) {
    logger.error('Error searching users-info', err);
    return [];
  }
};

module.exports = {
  getAllUsersInfo,
  getUserInfoById,
  searchUsersInfo
};
