// Vendor libs
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bluebird = require('bluebird');

// Mongoose promise settings
mongoose.Promise = bluebird;

// Schema
const StoreSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Organization'
    },
    name: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'stores'
  }
);

// Plugins
StoreSchema.plugin(mongoosePaginate);

// Model creation
const Store = mongoose.model('Store', StoreSchema);

// Export
module.exports = Store;
