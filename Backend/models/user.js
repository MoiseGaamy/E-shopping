const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true,'Please Enter your name'],
         maxLength:[40,'Your name cannot exceed 40 characters']
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email'],
      unique:true,
      validate:[validator.isEmail,'Please Enter a valid email']  
    },
    password: {
        type: String,
        required: [true, 'Please Enter your password'],
        minlength: [6, 'Your password must be stronger than 6 characters'],
        select:false
    },
    avatar: {
        public_id: {
            type: String,
            required:true
        },
        url: {
            type: String,
            required:true
        }
    },
    role: {
        type: String,
        default:'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

// encrypting password before saving

userSchema.pre('save', async function (next)
{
    if (!this.isModified('password'))
    {
        next()
    }

    this.password = await bcryptjs.hash(this.password, 10);
})

//compare password
userSchema.methods.comparePassword = async function (chechpassword)
{
return await bcryptjs.compare(chechpassword,this.password)
}

//generate json web token

userSchema.methods.getJwtToken = function ()
{
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_TIME }
    )
}
//generate password reset token 
userSchema.methods.getResetPasswordToken = function ()
{
    //Generate token 
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000000
    
    return resetToken
}

module.exports = mongoose.model('User', userSchema)