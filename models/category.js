const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required: true
    },
    books:[{
        bookid : { 
            type: mongoose.Schema.Types.ObjectId
        },
        title:{
            type:String
        },
        coverImage:{
            type: String,
            required:true
        }
    }
        
    ],
    count:{
        type: Number
    }
})



module.exports = mongoose.model('Category',categorySchema)