const paymentdetails = require("../models/paymentdetails");
const tickets = require("../models/tickets");
const crypto = require("crypto");
var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });
  

exports.createorderid = async(req, res, next) =>{
    try {
        const {
            amount,
            ticket_id,
            email,
        } = req.body
        let options = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          instance.orders.create(options, async function(err, order_id) {
            const  obj = {
                amount,
                ticket_id,
                email,
                order_id,
                verification:false,
            }

            const data = new paymentdetails(obj)
               const detail= await data.save();
            res.status(200).send({detail});
          }) 
        
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
} 

exports.paymentverify = async(req, res) => {
    try {
        const {
            order_id,
            payment_id,
            signature,
            ticket_id
            } = req.body

        let body = order_id + "|" + payment_id;
        var expectedSignature = crypto.createHmac('sha256',process.env.KEY_SECRET)
        .update(body.toString())
        .digest('hex');
        var response = {"signatureIsValid":"false"}
        if(expectedSignature === signature){
            await paymentdetails.updateOneOne({order_id},{payment_id,signature,verification:true})
            await tickets.updateOne({_id:ticket_id},{status:true})

            // update ticket avalability;
            res.status(200).send({msg:"booked"});
        }
        else{
            res.status(400).send({msg:"some thing went wrong"});
        }  
       // res.status(400).send({msg:"some thing went wrong"});
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}
