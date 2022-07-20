const express = require('express');
const router = express.Router()

const { processPayment, sendStripeApi} = require('../controllers/paymentController.js');
const { isAuthenticated} = require('../middleware/auth.js');

router.route('/payment/process').post(isAuthenticated, processPayment)
router.route('/stripeapi').get(isAuthenticated, sendStripeApi)

module.exports = router;