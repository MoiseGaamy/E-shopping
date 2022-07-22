const Product = require('../models/product.js');
const cloudinary = require('cloudinary')
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const APIFeatures = require('../utils/apiFeatures.js');

//create new product: /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) =>
{
     
    let images = [];
    if (typeof req.body.images === 'string')
    {
        images.push(req.body.images)
    } else
    {
        images = req.body.images
    }


    let imagesLink = [];
    for (let i = 0; i < images.length; i++)
    {
        const result = await cloudinary.v2.uploader.upload(images[i], { upload_preset: "e-shop" })
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLink
    req.body.user = req.user.id;

     const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
})

// get all product : /api/v1/products
exports.getProduct = catchAsyncErrors(async(req, res, next) =>
{
    const resPerPage = 4;
    const productCount = await Product.countDocuments()
    
    const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: products.length,
        resPerPage,
        productCount,
        products
    })
})
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) =>
{
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})


// get single product: /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) =>
{
    const product = await Product.findById(req.params.id);


    if (!product)
    {
        return next(new ErrorHandler('Product not found',404))
    }

    res.status(200).json({
        success: true,
        product
    })
})

//admin-update-product: /api/v1/admin/product/:id

exports.UpdateProduct = catchAsyncErrors( async (req,res, next) =>
{
    let product = await Product.findById(req.params.id);

    if (!product)
    {
         return next(new ErrorHandler('Product not found',404))
    }

    let images = [];
    if (typeof req.body.images === 'string')
    {
        images.push(req.body.images)
    } else
    {
        images = req.body.images
    }

    if (images !== undefined)
    {
        for (let i = 0; i < product.images.length; i++)
       {
           const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
       }
        
       let imagesLink = [];
       for (let i = 0; i < images.length; i++)
       {
           const result = await cloudinary.v2.uploader.upload(images[i], { upload_preset: "e-shop" })
           imagesLink.push({
               public_id: result.public_id,
               url: result.secure_url
           })
       }
       req.body.images = imagesLink
    }
    



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify:true
    })

    res.status(200).json({
        success: true,
        product
    })
})

//admin-delete-product : /api/v1/admin/product/:id

exports.deleteProduct = catchAsyncErrors(async (req, res, next) =>
{
    const product = await Product.findById(req.params.id);

    if (!product)
    {
         return next(new ErrorHandler('Product not found',404))
    }
    for (let i = 0; i < product.images.length; i++)
    {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await product.remove()

    res.status(200).json({
        success: true,
        message:'product was deleted'
    })
})

//create new review : /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) =>
{
    const { rating, comment, productId } = req.body;

    const newReview = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReview = product.reviews.find(r =>
        r.user.toString() === req.user._id.toString()
    )

    if (isReview)
    {
        product.reviews.forEach(review =>
        {
            if (review.user.toString() === req.user._id.toString())
            {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else
    {
        product.reviews.push(newReview)
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0)/ product.reviews.length
    await product.save({ validateBeforeSave: false })
    
    res.status(200).json({
        success: true,
    })
})

//Get product Reviews : /api/v1/reviews

exports.getProductReviews = catchAsyncErrors(async (req, res, next) =>
{
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })

})

//Delete Product Review : /api/v1/Reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) =>
{
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, {
        new: true,
        runValidators: true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true,
    })
})