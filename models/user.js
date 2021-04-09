const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
    },
    admin :{
        type:Boolean
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please enter an email"],
        lowercase:true,
        validate:[isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter an password"],
        minlength:[4,"Minimum password is 4 characters"]
    },
})

//mongoose hook to hash the password
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

//creating a statics login method
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth =  await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email")
}


module.exports = mongoose.model('user',userSchema)