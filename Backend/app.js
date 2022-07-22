const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let cors = require('cors');
const fileUpload = require('express-fileupload');
// const dotenv = require('dotenv');
const path = require('path');

app.use(cors())
app.options('*', cors())
const ErrorMiddleware = require('./middleware/errors.js')
//setting up dotenv config
if(process.env.NODE_ENV !== 'production') require('dotenv').config({ path: 'Backend/config/config.env' })

// app.use(express.json())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())



app.use(function (req, res, next)
{
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


//Import all Routes
const products = require('./routes/product.js')
const auth = require('./routes/auth.js')
const order = require('./routes/order.js')
const payment = require('./routes/payment.js')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)
app.use('/api/v1', payment)


if (process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname, '../Frontend/build')))

    app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, '../Frontend/build/index.html'))
    })
}

//middlewares
app.use(ErrorMiddleware)

module.exports = app;