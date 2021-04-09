const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleID:{
        type:String,
        required : true
    },

    displayName:{
        type:String,
        required : true
    },

    firstName:{
        type:String,
        required : true
    },

    lastName:{
        type:String,
        required : true
    },

    image:{
        type:String,
      
    },
    mail:{
        type:String,
        required:true
    },
    createdAt :{
        type:Date,
        default : Date.now
    },
    admin :{
        type:Boolean
    }
})

module.exports = mongoose.model('User2', UserSchema);