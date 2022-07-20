const express = require('express');
const router = express.Router()


const { isAuthenticated, authorizeRoles } = require('../middleware/auth.js');
const { newOrder ,getSingleOrder,myOrders, getAllOrders, ProccessOrder, deleteOrder} = require('../controllers/orderController.js');

router.route('/order/new').post(isAuthenticated, newOrder)
router.route('/order/:id').get(isAuthenticated, getSingleOrder)
router.route('/orders/me').get(isAuthenticated, myOrders)
router.route('/admin/orders').get(isAuthenticated,authorizeRoles('admin'), getAllOrders)
router.route('/admin/order/:id')
    .put(isAuthenticated, authorizeRoles('admin'), ProccessOrder)
    .delete(isAuthenticated, authorizeRoles('admin'), deleteOrder)

module.exports = router;