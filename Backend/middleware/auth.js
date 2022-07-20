const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");

//a middleware for verifying wether the user is authentication

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) =>
{
    const { token } = req.cookies;
    
    if (!token)
    {
        return next(new ErrorHandler('login before accessing this ressource',401))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);

    next();
})
//authorize roles middleware

exports.authorizeRoles = (...Roles) =>
{
    return (req, res, next)=>{
        if (!Roles.includes(req.user.role))
        {
            next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access the ressources`,403))
        }
        next()
    }
}