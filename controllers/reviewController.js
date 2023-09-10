const place = require("../models/places");

exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}


exports.showReview = async(req, res, next) =>{
    try {
        const {city} = req.body
        const data = await place.findOne({name:city})  
        res.status(200).send(data.reviews);
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
} 


exports.addReview = async(req, res) => {
    try {
        const {name,
            reviewername,
            tripMember,
            comment,
            rate,
            expendature,
            email} = req.body
        const data = await place.findOne({name:name})
        const obj = {
            reviewername,
            tripMember,
            comment,
            rate,
            expendature,
            email
        }
        data.reviews.push(obj)
        
        await place.updateOne({name:name},{reviews:data})
        res.status(200).send({msg:"setted"});
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}
