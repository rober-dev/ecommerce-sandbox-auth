// Vendor libs
const logger = require('@minimal-ecommerce-sandbox/common/src/logger');

const getAllUsers = async (parent, args, { models }) => {
  try {
    const { User } = models;

    const result = await User.find();

    return result;
  } catch (err) {
    console.error('Error getting all users. ', err);
    return [];
  }
};

const getUserById = async (parent, { id: userId }, { models }) => {
  try {
    const { User } = models;

    const result = await User.findById(userId);

    return result;
  } catch (err) {
    console.error('Error getting User by id', err);
    return null;
  }
};

const searchUsers = async (
  parent,
  { filter, page, limit, sort, asc },
  { models }
) => {
  try {
    const { User } = models;

    const query = {};

    // Set filters
    if (filter) {
      query.email = new RegExp(filter, 'i');
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

    const result = await User.paginate(query, options);

    return result;
  } catch (err) {
    logger.error('Error searching users', err);
    return [];
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  searchUsers
};
