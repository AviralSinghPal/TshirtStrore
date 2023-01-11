const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const crypto = require('node:crypto')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please provide a name"],
        maxlength:[40, "max length is 40 characters"]
    },
    email:{
        type: String,
        required: [true,"Please provide an email"],
        unique: true,
        validate: [validator.isEmail,"Please enter email in correct format"]
    },
    password:{
        type: String,
        required:true,
        maxlength: [8,"password should be atleast 8 characters"],
        select: false
    },
    role:{
        type: String,
        default: 'user',

    },
    photo: {
        id: {
            type:String,
            required: true
        },
        secure_url:{
            type:String,
            required: true
        },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,


},{ timestamps: true })

//encrypt password before saving  BY using PRE HOOKS
userSchema.pre('save',async function(next){
    if (!this.isModified('password')){
         return next();
        }
    this.password= await bcrypt.hash(this.password,10)
})

//create and return JWT token
userSchema.methods.getJwtToken= function (){
    jwt.sign({id: this._id},proces.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRY})//sign method is for creating the token first we pass payload i.e id
}

//genrate a forgot Password token - (we just need to genrate a random string here we can write a manual function to generate random string but here it is preffered to use CRYPTO package  )
userSchema.method.getForgotPasswordToken = function () {
    //
    const forgotToken = crypto.randomBytes(20).toString('hex');

    this.forgotPasswordToken= crypto.createHash('sha256').update(forgotToken).digest('hex')
//token expiry time is being set to 20 min 
    this.forgotPasswordTokenExpiry = Date.now() + 20*60*1000;

    return forgotToken;
}

//validate password with user provided password
userSchema.methods.validatePassword = async function(userSendPassword){
    bcrypt.compare(userSendPassword, this.password)
}



module.exports = mongoose.model("User",userSchema)