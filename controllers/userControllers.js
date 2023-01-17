const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require("../utils/customError");
const cookieToken = require('../utils/cookieToken');
const mailHelper = require('../utils/emailHelper');

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

    const user = await User.findOne({email}).select("+password")
    console.log(user);
    if(!user) return next(new CustomError("User not found in DB",400));

    const isPasswordCorrect = await user.validatePassword(password);

    if(!isPasswordCorrect) return next( new CustomError("You are not registered in our database", 400));

    //now if the user has provided correct email and password , now we send token to user 
    cookieToken(user, res);
});

exports.getAll = BigPromise(async(req,res,next) => {
    const [...user] = (await User.find());
    console.log(user[0].name);

    res.status(200).json({
        success: true,
        user
    })
});
exports.logout = BigPromise(async(req,res,next) => {
    res.cookie('token',null, {
        expires : new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logout sucess"
    });
});
exports.forgotPassword = BigPromise(async(req,res,next) => {

    const {email} = req.body;
    
    const user =await User.findOne({email});
    
    console.log(user);
    
    if(!user){
        return next(new CustomError('Email not found as registered ', 400))
    }
    
    const forgotToken = user.getForgotPasswordToken()

    await user.save({validateBeforeSave: false})

    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`

    const message = `Copy paste this link in the URL and hit enter \n \n 
     ${myUrl}`

    try{
        await mailHelper({
            email: user.email,
            subject: "T-Shirt store - Password reset email",
            message
        })
//sending a response message after successfully sendingemail 
        res.status(200).json({
            success: true,
            message: "Email sent successfully by aviralpal@gmail.com"
        })
    }
    catch(error){
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})
        return next(new CustomError(error.message,401))
    }
});
exports.passwordReset = BigPromise(async(req,res,next) => {
    const token = req.params.token;
    
    const encryToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: {$gt: Date.now()}
     })
     if(!user){
        return next(new CustomError('Token is invalid or expired'))
     }
     if(req.body.password !==  )
});