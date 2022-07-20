const express = require('express');
const router = express.Router()


const {
    getProduct,
    newProduct,
    getSingleProduct,
    UpdateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
    getAdminProducts
} = require('../controllers/productController.js')

const {isAuthenticated, authorizeRoles} = require('../middleware/auth.js')

router.route('/products').get(getProduct)
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/products').get(isAuthenticated,authorizeRoles('admin'),getAdminProducts)
router.route('/admin/product/new').post(isAuthenticated,authorizeRoles('admin'),newProduct)
router.route('/admin/product/:id')
                                .put(isAuthenticated,authorizeRoles('admin'),UpdateProduct)
                                .delete(isAuthenticated,authorizeRoles('admin'),deleteProduct)

router.route('/review').put(isAuthenticated,createProductReview)
router.route('/reviews').get(isAuthenticated, getProductReviews)
                        .delete(isAuthenticated, deleteReview)

module.exports = router;