const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    email:{
        type:String,
    },

    data:{
        type:Array,
        }
});
const usr= new mongoose.model("OnlyTest",userschema);
module.exports=usr;