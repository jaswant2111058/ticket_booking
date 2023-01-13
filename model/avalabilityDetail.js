const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    
    org_email:{
        type:String,
       unique:[true,"email already exist"]
    },
    total_seats:{
        type:String
    },
    avalable_seats:{
        type:String,
       
    }, 

    booked_seats:{
        type:Array,
        
         }
    
});
const usr= new mongoose.model("avalability_detail",userschema);
module.exports=usr;