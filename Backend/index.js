const app = require('./app.js');
const connectDatabase = require('./config/database.js')
// const dotenv = require('dotenv');
const cloudinary = require('cloudinary');


//handling uncaughtException
process.on('uncaughtException', err =>
{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught Exception');
    process.exit(1)
})

//setting up dotenv config
if(process.env.NODE_ENV !=='production') require('dotenv').config({ path: 'Backend/config/config.env' })

// cloudinary configuration
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,  
  api_key:process.env.CLOUDINARY_CLOUD_API_KEY,  
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
})

//connect database
connectDatabase()

const server = app.listen(process.env.PORT, () =>
{
    console.log(`server is running on port ${process.env.PORT} and in ${process.env.NODE_ENV} mode`)
})

// Handled Unhandled Promise Rejection

process.on('unhandledRejection', err =>
{
    console.log(`Error: ${err.message}`);
    console.log('shutting down the server due to unhandled rejection');
    server.close(() =>
    {
        process.exit(1);
    })
})