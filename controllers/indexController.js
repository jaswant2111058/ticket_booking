const events = require("../models/events");
const tickets = require("../models/tickets");

exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}

// exports.places = async(req, res, next) =>{
//     try {
//         const {city} = req.body
//         const data = await place.findOne({name:city})  
//         res.status(200).send(data);
//     } catch (error) {
//         res.status(500).json({
//             message : error.message
//         })
//     }
// } 

exports.showEvents = async(req, res) => {
    try {
        const data = await events.find({})
        res.status(200).send({events:data});
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

exports.bookEvent = async (req,res)=>{
    try{
       const {
        event_id,
        data_time,
        venue,
        seat,
        price,
        email,
       }= req.body
       const details = {
        event_id,
        data_time,
        venue,
        seat,
        price,
        email,
        status:false,
       }
        const ticket = new tickets(details);
        const data = await ticket.save()
        // update seats in event schema
        res.status(200).json(data);
    }
    catch(e){
        res.send(e).status(400)
    }
}

exports.cancelticket=async (req,res)=>{
    try{

        // cancel ticket.....

    }
    catch(e){
        res.send(e).status(400)
    }
}