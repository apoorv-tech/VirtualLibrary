const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required: true
    },
    description:{
        type:String,
    },
    pageCount:{
        type:Number,
        required:true
    },
    CreatedAt:{
        type:Date,
        required:true,
        default: Date.now
    },
    coverImage:{
        type: Buffer,
        required:true
    },
    coverImageType:{
        type:String,
        required: true
    },
    pdf:{
        type: Buffer,
        required:true
    },
    pdfType:{
        type:String,
        required: true
    }
})

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null){
        return `data:${this.coverImageType};charset=utf-8;base64,
        ${this.coverImage.toString('base64')}`
    }
})

bookSchema.virtual('pdfPath').get(function(){
    if(this.coverImage != null && this.pdfType != null){
        return `data:${this.pdfType};charset=utf-8;base64,
        ${this.pdf.toString('base64')}`
    }
})


module.exports = mongoose.model('Book',bookSchema)