const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    user_name:{
        type:String,
    },
    user_email:{
        type:String,
       unique:[true,"email already exist"]
    },
    email_status:{
        type:String
    },
    password:{
        type:String,
       
    },

    bookedTickets:{
        type:Array,
        }
});
const usr= new mongoose.model("user_detail",userschema);
module.exports=usr;