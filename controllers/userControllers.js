const User = require('../models/user')
const BigPromise = require('../middleware/bigPromise')
const CustomError = require("../utils/customError");
const cookieToken = require('../utils/cookieToken');
const mailHelper = require('../utils/emailHelper');
const user = require('../models/user');


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

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

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

exports.passwordReset = BigPromise(async (req, res, next) => {
    //get token from params
    const token = req.params.token;
  
    // hash the token as db also stores the hashed version
    const encryToken = crypto.createHash("sha256").update(token).digest("hex");
  
    // find user based on hased on token and time in future
    const user = await User.findOne({
      encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new CustomError("Token is invalid or expired", 400));
    }
  
    // check if password and conf password matched
    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new CustomError("password and confirm password do not match", 400)
      );
    }
  
    // update password field in DB
    user.password = req.body.password;
  
    // reset token fields
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
  
    // save the user
    await user.save();
  
    // send a JSON response OR send token
  
    cookieToken(user, res);
});  

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {   

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: 'true',
        user
    });
});    

exports.changePassword = BigPromise(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");

    const IscorrectOldPassword = await user.validatePassword(req.body.oldPassword);

    if(!IscorrectOldPassword){
        return next(new CustomError('old passowrd is incorrect',400));
    }
    user.password = req.body.password;
    
    await user.save();
    cookieToken(user, res);
});  

exports.updateuserDetails = BigPromise(async (req, res, next) => {
    
    const newData = {
        name: req.body.name,
        email: req.body.email
    };

    //can update photo her later on as an additional functionality

    const user = await User.findByIdAndUpdate(req.user.id,newData,{
        new: true,
        runValidators: true,
        useFindAndModify: false//just for backward compatibility , in newer version of mongo it might already be false by default       
    });
    res.status(200).json({
        success: true
    })    
});  

exports.adminAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: "true",
        users
    });
});  

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        next(new CustomError("No user found ",400));
    }
    res.status(200).json({
        success: "true",
        user
    })
});


exports.adminUpdateOneUserDetail = BigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    //can update photo her later on as an additional functionality

    const user = await User.findByIdAndUpdate(req.user.id,newData,{
        new: true,
        runValidators: true,
        useFindAndModify: false//just for backward compatibility , in newer version of mongo it might already be false by default       
    });
    res.status(200).json({
        success: true,
        user
    })    
});

exports.adminDeleteOneUserDetail = BigPromise(async (req, res, next) => {
   const user = await User.findById(req.params.id);
    if(!user) {
        return next(new CustomError("No user found", 401));
    }
    //in case of photo we need to delete phtot first from cloudinary as if we delte user first then refernce of user will be removed
    //can update photo her later on as an additional functionality

    await user.remove();
    res.status(200).json({
        success: true
    })    
});