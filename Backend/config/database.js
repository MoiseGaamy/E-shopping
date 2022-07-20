const mongoose = require('mongoose');



const connectDatabase = () =>
{
    mongoose.connect(`${process.env.DB_URL}`, {
        useUnifiedTopology: true,
    }).then(con =>
    {
        console.log(`database connected successfully to host ${con.connection.host}`)
    }).catch(err =>
    {
        console.log('there has been an error somewhere',err.message)
    })
}

module.exports = connectDatabase