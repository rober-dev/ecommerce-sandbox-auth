// Vendor libs
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bluebird = require('bluebird');

// Custom libs
const regexp = require('@minimal-ecommerce-sandbox/shared/src/common/regexp');

// Mongoose promise settings
mongoose.Promise = bluebird;

// Schema
const UserSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Store'
    },
    email: {
      type: String,
      required: true,
      match: regexp.email
    },
    username: {
      type: String,
      required: true,
      match: regexp.slug
    },
    salt: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    },
    lastLogin: {
      type: String,
      required: false,
      default: 0
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0
    },
    lockUntil: {
      type: Date,
      required: false
    },
    roles: [
      {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'USER', 'GUEST'],
        required: true
      }
    ]
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Plugins
UserSchema.plugin(mongoosePaginate);

// Model creation
const User = mongoose.model('User', UserSchema);

// Exportation
module.exports = User;
