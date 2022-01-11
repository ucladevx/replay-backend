const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const locationModel = require("../models/location");

//.update function
exports.update = async (req, res) => {
    console.log("Location Update Request Received.");

    const { latitude, longitude } = req.body;
    try {
        const newLocation = new locationModel({
            type: [latitude, longitude],
        });
        await newLocation.save();
        
        return res.status(200).json({
            message: "Location Successfully Updated.",
            newLocation,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }    
};

