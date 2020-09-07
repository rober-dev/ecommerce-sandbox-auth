// Vendor libs
const { _ } = require('lodash');

// Custom libs
const { brandResolver } = require('./modules/brand');

// Exportation
module.exports = _.merge({}, brandResolver);
