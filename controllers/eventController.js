const event = require("../models/events");
const users = require("../models/users");
const search = require("../models/search");


exports.showEvent = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        let events_id = await users.find({ _id: user_id })
        const data = events_id.events
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.addEvent = async (req, res) => {
    try {
        const { title,
            name,
            date,
            time,
            price,
            available_seat,
            seats,
            user_id,
            img,
            content,
            venue
        } = req.body
        const obj = {
            title,
            name,
            date,
            time,
            price,
            available_seat,
            seats,
            user_id,
            img,
            content,
            venue
        }
        const new_event = new event(obj);
        const saved = await new_event.save();  
       
        const new_search = new search({name,venue,eventId:new_event._id});
        const sv= await new_search.save();
        
       await users.findByIdAndUpdate(user_id,{
            $push:{events:saved._id}
        })   
        res.status(200).send({ msg: "saved", event: saved });
    }   catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.updateEvent = async (req, res) => {
    try {
        const { title,
            name,
            date,
            time,
            price,
            available_seat,
            seats,
            user_id,
            img,
            content,
            venue
        } = req.body
        console.log(req.body)
        // const data = await place.findOne({name:city})
        const obj = {
            title,
            name,
            date,
            time,
            price,
            available_seat,
            seats,
            user_id,
            img,
            content,
            venue
        }
        console.log(obj)
        const new_event = new event(obj);
        const saved = await new_event.save();
        console.log(saved)
        // const new_search = new event({name,venue,eventId:new_event._id});
        //               await new_search.save();
        // users.findByIdAndUpdate(user_id,{
        //     $push:{events:new_event._id}
        // })
        // let events_id = await users.findOne({ _id: user_id })
        // events_id = events_id.events
        // events_id.push(new_event._id)
        // await users.updateOne({ _id: user_id }, { events: events_id })
        res.status(200).send({ msg: "saved", event: saved });
    }   catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.deleteEvent = async (req, res) => {

    try {
        const { _id, user_id } = req.body;
        await event.deleteOne({ _id });
        let events_id = await users.findOne({ _id: user_id })
        events_id = events_id.events
        let index = events_id.findIndex(_id)
        let first = events_id.slice(0, index)
        let sec = events_id.slice(index + 1, events_id.length)
        events_id = first.concat(sec)
        await users.updateOne({ _id: user_id }, { events: events_id })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
