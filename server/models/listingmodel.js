const mongoose = require('mongoose')

const listingschema = new mongoose.Schema({
    name:String,
    description:String,
    address:String,
    regularprice:Number,
    discountprice:Number,
    bathrooms:Number,
    bedrooms:Number,
    furnished:Boolean,
    parking:Boolean,
    type:String,
    offer:Boolean,
    imgurls:Array,
    userref:String
},{timestamps:true})


module.exports = mongoose.model('listing',listingschema)