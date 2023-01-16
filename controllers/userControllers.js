const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require("../utils/customError");
const cookieToken = require('../utils/cookieToken');

exports.signup = BigPromise(async(req,res,next) => {
    const {name, email, password} = req.body

    if(!email || !name || !password){
        return next(new CustomError("Name, password and email are required", 401));
    }

    const user = await User.create({
        name,email,password
    })

   cookieToken(user,res)
});

exports.login = BigPromise(async(req,res,next)=>{

    const {email, password} = req.body;
    //check for presence of email and password
    if(!email || !password) return next(new CustomError("Please provide email and password",401));

    const user = User.findOne({email}).select("+password")
    if(!user) return next(new CustomError("User not found in DB",400));

    const isPasswordCorrect = await user.validatePassword(password);

    if(!isPasswordCorrect) return next( new CustomError("You are not registered in our database", 400));

    //now if the user has provided correct email and password , now we send token to user 
    cookieToken(user, res);
});