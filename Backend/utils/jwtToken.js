// create a sendToken function
const sendToken = (user,statusCode,res) =>
{
    // create a jwt token
    const token = user.getJwtToken();

    //create the options
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 1000
        ),
        httpOnly:true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;