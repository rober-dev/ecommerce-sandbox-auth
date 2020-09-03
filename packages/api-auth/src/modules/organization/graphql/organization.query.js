// Vendor libs
const logger = require('@minimal-ecommerce-sandbox/common/src/logger');

const getAllOrganizations = async (parent, args, { models }) => {
  try {
    const { Organization } = models;

    const result = await Organization.find();

    return result;
  } catch (err) {
    console.error('Error getting all organizations. ', err);
    return [];
  }
};

const getOrganizationById = async (
  parent,
  { id: organizationId },
  { models }
) => {
  try {
    const { Organization } = models;

    const result = await Organization.findById(organizationId);

    return result;
  } catch (err) {
    console.error('Error getting Organization by id', err);
    return null;
  }
};

const searchOrganizations = async (
  parent,
  { filter, page, limit, sort, asc },
  { models }
) => {
  try {
    const { Organization } = models;

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

    const result = await Organization.paginate(query, options);

    return result;
  } catch (err) {
    logger.error('Error searching organizations', err);
    return [];
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  searchOrganizations
};
