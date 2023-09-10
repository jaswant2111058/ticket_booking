const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    date: {
        type:String,
        required: true
    },
    time: {
        type:String,
        required: true
    },
    venue:{
        type:String,
        required: true
    },
    seats:{
        front:Number,
        middel:Number,
        back:Number,
        normal:Number,
        primium:Number,
    },
    available_seats: {
        fronts:Number,
        middel:Number,
        back:Number,
        normal:Number,
        primium:Number,
    },
    price:{
        fronts:Number,
        middel:Number,
        back:Number,
        normal:Number,
        primium:Number
    },
    title:String,
    user_id:String,
    img:Array, 
    content:String,
    visits:Number
},
{
    timestamps: true
});

const events = mongoose.model("events", Schema);

module.exports = events