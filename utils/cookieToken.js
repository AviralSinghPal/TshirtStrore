const getJwtToken = require('../models/user')
const cookieToken = (user, res)=>{
    const token = user.getJwtToken()
    const options = {
        expires: new Date(Date.now()+process.env.COOKIE_TIME*24*60*60*1000),
        httpOnly: true
    }

    res.status(200).cookie('token', token, options).json({
        sucess:true,
        token,
        user,
    });
}

module.exports = cookieToken