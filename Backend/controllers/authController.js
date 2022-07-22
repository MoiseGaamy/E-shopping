const User = require('../models/user.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const sendToken = require('../utils/jwtToken.js');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');
const cloudinary = require('cloudinary');


// register user : /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) =>
{    
    if (!req.body.avatar)
    {
        return next(new ErrorHandler('avatar does not exist',404))
    }
    const result = await cloudinary.v2.uploader.unsigned_upload(req.body.avatar,"e-shop", {cloud_name:process.env.CLOUDINARY_CLOUD_NAME }, function (error, result) { console.log(result,error) })
     
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url:result.secure_url
        }
    })
    
    //generate json webToken
    sendToken(user,200,res)
})

//login user : /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) =>
{
    const { email, password } = req.body;

    if (!email || !password)
    {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user)
    {
        return next(new ErrorHandler('user doesn\'t exist in the databse', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched)
    {
        return next(new ErrorHandler('password do not match', 401));
    }

    sendToken(user,200,res)
})

//forgot password : /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) =>
{
    //check the email provided by the user

    const user = await User.findOne({ email: req.body.email });

    if(!user){
      return   next(new ErrorHandler('user is not found with this email',404))
    }
    //set the getResetPasswordToken

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false });

    //create reset password url

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    // ${req.protocol}://${req.get('host')}/api/v1

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n you have not requested this email, then ignore it.`

    //time to send the email

    try {
        await sendEmail({
            email: user.email,
            subject: 'E-shop password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message:`email sent to :${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        
        return next(new ErrorHandler(error.message),500)
    }
})

//reset password : /api/v1/password/reset

exports.resetPassword = catchAsyncErrors(async (req, res, next) =>
{
    // Hash url token

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    
    if (!user)
    {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword)
    {
        return next(new ErrorHandler('Password does not match',400))
    }

    //setup new password

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    //send the token again

    sendToken(user,200,res)
})

//get currently user logged in details : /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next) =>
{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// update / change password : /api/v1/password/update

exports.updatePassword = catchAsyncErrors(async (req, res, next) =>
{
    const user = await User.findById(req.user.id).select('+password');

    //check previous password

    const oldPassword = await user.comparePassword(req.body.oldPassword)

    if (!oldPassword)
    {
        return next(new ErrorHandler('Old Password is incorrect', 400))
    }

    user.password = req.body.password
    await user.save()

    sendToken(user,200,res)
})

//update user profile : /api/v1/me/update

exports.updateProfile = catchAsyncErrors(async (req, res, next) =>
{
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //update avatar: TODO
    if (req.body.avatar !== '')
    {
        const getUser = await User.findById(req.user.id)

        const image_id = getUser.avatar.public_id;

        const detroyImage = await cloudinary.v2.uploader.destroy(image_id)

        const updateAgain = await cloudinary.v2.uploader.unsigned_upload(req.body.avatar,"e-shop", {cloud_name:process.env.CLOUDINARY_CLOUD_NAME }, function (error, result) { console.log(result,error) })
        
        newUserData.avatar = {
            public_id: updateAgain.public_id,
            url: updateAgain.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true,
        user
    })
})

// Admin - Get All Users : /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async (req, res, next) =>
{
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

//Admin- Get user details : /api/v1/admin/user:id

exports.getUserDetails = catchAsyncErrors(async (req, res, next) =>
{
    const user = await User.findById(req.params.id)

    if (!user)
    {
        return next(new ErrorHandler(`user is not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Admin - update particular user : /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async (req, res, next) =>
{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true,
        user
    })
})

// Admin - delete a particular user : /api/v1/admin/user/:id

exports.deleteUser = catchAsyncErrors(async (req, res, next) =>
{
    const user = await User.findById(req.params.id)

    if (!user)
    {
        return next(new ErrorHandler(`user is not found with id:${req.params.id}`))
    }

    //Remove avatar from cloundinary 
    const image_id = user.avatar.public_id;

        const detroyImage = await cloudinary.v2.uploader.destroy(image_id)

    await user.remove()

    res.status(200).json({
        success: true,
    })
})
//logout : /api/v1/logout

exports.logoutUser = catchAsyncErrors(async (req, res, next) =>
{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message:'user logged out'
    })
})
