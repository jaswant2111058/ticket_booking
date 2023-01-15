const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    
    user_email:{
        type:String,
       unique:[true,"email already exist"]
    },
    ticketId:{
        type:Array,
    },

        orderId:{
        type:Array,
        },
        paymentId:{
            type:Array,
            },
        orderId:{
             type:Array,
                },
        signature:{
            type:Array,
        },
        paymentStatus:
        {
            type:Array
        },
        counter:
        {
            type:Number,
        }
});
const usr= new mongoose.model("payment_detail",userschema);
module.exports=usr;