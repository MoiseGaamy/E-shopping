const Order = require('../models/order.js')
const Product = require('../models/product.js')

const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');

//create a new order : /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next) =>
{
    const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user:req.user._id
    })

    res.status(200).json({
        success: true,
        message:'order created',
        order
    })
})

//Get single order: /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) =>
{
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order)
    {
        return next(new ErrorHandler('no order found',404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user orders :/api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) =>
{
    const orders = await Order.find({ user: req.user.id })
    
    res.status(200).json({
        success: true,
        ordersNum:orders.length,
        orders
    })
})

//Admin - get all order

exports.getAllOrders = catchAsyncErrors(async (req, res, next) =>
{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(item =>
    {
        totalAmount += item.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Admin - Update Process Order : /api/v1/admin/order/:id

exports.ProccessOrder = catchAsyncErrors(async (req, res, next) =>
{
    const order = await Order.findById(req.params.id)

    if (order.orderStatus === 'Delivered')
    {
        return next(new ErrorHandler('You have already delivered this order',400))
        
    }

    order.orderItems.forEach( async item =>
    {
      await  updateStock(item.product,item.quantity)
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()
    
    await order.save()

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id,quantity)
{
    const product = await Product.findById(id);
    product.stock = product.stock - quantity
    
    await product.save({ validateBeforeSave:false})
}

//Delete order : /api/v1/admin/order/:id

exports.deleteOrder = catchAsyncErrors(async (req, res, next) =>
{
    const order = await Order.findById(req.params.id);

    if (!order)
    {
        return next(new ErrorHandler(`no order found with this ${req.params.id}`),404)
    }

    await order.remove()

    res.status(200).json({
        success: true,
        order
    })
})