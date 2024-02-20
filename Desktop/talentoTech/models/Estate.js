const mongoose = require('mongoose')

const EstateSchema = new mongoose.Schema({
    address:{
        type: String,
        required:true,
    },
    city:{
        type: String,
        required:true,
    },
    state:{
        type: String,
        required:true,
    },
    size:{
        type: Number,
        required:true,
    },
    type:{
        type: String,
        required:true,
    },
    zipcode:{
        type: String,
        required:true,
    },
    rooms:{
        type: Number,
        require: true
    },
    bathrooms:{
        type: Number,
        required: true
    },
    parking: {
        type: Boolean,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true
    }

})
module.exports = mongoose.model('estate', EstateSchema) 