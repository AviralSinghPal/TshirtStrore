const User = require('../models/user');
const BigPromise = require('../middleware/bigPromise');
const CustomError = require("../utils/customError");
const jwt = require('jsonwebtoken')
require('dotenv').config()



exports.isLoggedIn = BigPromise(async(req,res,next)=>{
    const token = req.cookies.token;
    console.log(req.cookies);
if(!token && req.header("Authorization")){
    token = req.header("Authorization").replace("Bearer ","");
}

    
    if(!token){
        return next(new CustomError('Login first to access this page',401)); 
    }
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
});