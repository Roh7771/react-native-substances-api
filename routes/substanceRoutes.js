const express = require('express');
const substanceController = require(`./../controllers/substanceController`);
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route(`/`)
  .get(authController.protect, substanceController.getAllSubstances)

module.exports = router;