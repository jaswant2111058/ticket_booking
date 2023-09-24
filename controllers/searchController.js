const search = require("../models/search");

exports.serverStatus = (req, res, next) => {
    res.status(200).send("Server is up and running.")
}


exports.showSearch = async(req, res, next) =>{
    try {
        const query = req.query.q
        const withName = await search.find({name:query})  
        const withVenue = await search.find({venue:query})  
        res.status(200).send({withName},{withVenue});
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
        const data = await search.findOne({name:name})
        const obj = {
            reviewername,
            tripMember,
            comment,
            rate,
            expendature,
            email
        }
        data.reviews.push(obj)
        
        await search.updateOne({name:name},{reviews:data})
        res.status(200).send({msg:"setted"});
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}
