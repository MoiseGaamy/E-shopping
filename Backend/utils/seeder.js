const Product = require('../models/product.js')
const dotenv = require('dotenv')
const connectDatabase = require('../config/database.js')

const products = require('../data/products.json')


//setting for dotenv

dotenv.config({ path: "Backend/config/config.env" });

//database connection
connectDatabase()

//seeder function
const seedProduct = async () =>
{
    try {
        await Product.deleteMany();
        console.log('products have been deleted')
        await Product.insertMany(products)
        console.log('products have been inserted')

        process.exit()

    } catch (error) {
        console.log(error)
        process.exit()
    }
}

seedProduct()