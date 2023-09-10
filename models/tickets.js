const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    event_id : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    date_time: {
        type:String,
        required: true
    },
    venue:{
        type:String,
        required: true
    },
    seat:{
       type: Array,
       required: true
    },
    price:{
        type:Number,
    },
    status:{
        type:Boolean,
        required:true
    } 
},
{
    timestamps: true
});

const tickets = mongoose.model("tickets", Schema);

module.exports = tickets