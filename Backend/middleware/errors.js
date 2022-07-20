const ErrorHandler = require('../utils/errorHandler.js');

module.exports = (err, req, res, next) =>
{
    err.statusCode = err.statusCode || 500;
    
    if (process.env.NODE_ENV==='development')
    {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    
    if (process.env.NODE_ENV==='production')
    {
        let error = {...err}
        
        error.message = err.message

        //wrong Mongoose Id error
        if (err.name === 'CastError')
        {
            const message = `Ressource not found .invalid ${err.path}.`
            error = new ErrorHandler(message, 400);
        }
        //handling Mongoose Validation Error
        if (err.name === 'ValidatorError')
        {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message,400)
        }
        //Handling Mongoose duplicate key errors
        if (error.code === 11000)
        {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }
        // Handling wrong jwt error
         if (err.name === 'JsonwebTokenError')
        {
            const message = 'JSON web Token is invalid. Try Again!!!';
            error = new ErrorHandler(message,400)
        }
        // Handling Expired JWT error
         if (err.name === 'TokenExpiredError')
        {
            const message = 'JSON web Token is expired. Try Again!!!';
            error = new ErrorHandler(message,400)
        }
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }
}