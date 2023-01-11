const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');

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

//validate password with user provided password
userSchema.methods.validatePassword = async function(userSendPassword){
    bcrypt.compare(userSendPassword, this.password)
}



module.exports = mongoose.model("User",userSchema)