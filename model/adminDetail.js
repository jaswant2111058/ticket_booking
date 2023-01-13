const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    org_name:{
        type:String,
    },
    org_email:{
        type:String,
       unique:[true,"email already exist"]
    },
    email_status:{
        type:String
    },
    password:{
        type:String,
       
    },

    eventNamePrice:{
        type:Array,
        
         },
    product_price:{
        type:Array,
    },
    product_quanitity:{
        type:Array,
    }
    
});
const usr= new mongoose.model("Admin_detail",userschema);
module.exports=usr;