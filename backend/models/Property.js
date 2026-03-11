const mongoose = require("mongoose")

const PropertySchema = new mongoose.Schema({
title:String,
location:String,
price:Number,
type:String,
owner:String
})

module.exports = mongoose.model("Property",PropertySchema)