const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    director:{
        type: String,
        required:true,
    },
    year:{
        type: Number,
        required:true,
    },
    duration:{
        type: Number,
        required:true,
    },
    category:{
        type: String,
        required:true,
    }
})
module.exports = mongoose.model('movie', MovieSchema) 