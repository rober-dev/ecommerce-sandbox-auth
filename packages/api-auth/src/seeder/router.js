// Vendor libs
const express = require('express');

const router = express.Router();

// Custom libs
const organizationsRoutes = require('./organizations');
const storesRoutes = require('./stores');
const usersRoutes = require('./users');
const userInfoRoutes = require('./user-info');

// Assign routes
router.use('/organizations', organizationsRoutes);
router.use('/stores', storesRoutes);
router.use('/users', usersRoutes);
router.use('/user-info', userInfoRoutes);

router.get('/', (req, res) => {
  res.json('Import all from AUTH');
});

// Exportation
module.exports = router;
