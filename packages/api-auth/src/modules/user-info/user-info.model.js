// Vendor libs
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bluebird = require('bluebird');

// Mongoose promise settings
mongoose.Promise = bluebird;

// Schema
const UserInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    firstName: {
      type: String,
      required: true,
      ref: 'User'
    },
    lastName: {
      type: String,
      required: false,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'users-info'
  }
);

// Plugins
UserInfoSchema.plugin(mongoosePaginate);

// Model creation
const UserInfo = mongoose.model('UserInfo', UserInfoSchema);

// Exportation
module.exports = UserInfo;
