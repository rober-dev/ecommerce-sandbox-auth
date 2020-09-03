// Vendor libs
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bluebird = require('bluebird');

// Mongoose promise settings
mongoose.Promise = bluebird;

// Schema
const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'organizations'
  }
);

// Plugins
ModelSchema.plugin(mongoosePaginate);

// Model creation
const Model = mongoose.model('Organization', ModelSchema);

// Exportation
module.exports = Model;
