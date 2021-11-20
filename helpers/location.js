const User = require("../models/user")

exports.nearby = async (req, res) => {

    // ? Receive latest coords from user or extrapolate coords from username embedded in JWT?
    const { latitude, longitude } = req.query;

    let nearbyLocations
    try {
        nearbyLocations = await User.find({
            currentLocation: {
                $geoWithin: {
                    $centerSphere: [[longitude, latitude], 5 / 3963.2] // 5 miles in radian.
                }
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }

    return res.status(200).json({
        message: "Query successful.",
        nearbyLocations
    })
};

// * If we want to query the Location collection separately:
// const { Location } = require("../models/location")

// exports.nearby = async (req, res) => {

//     const { latitude, longitude } = req.query;

//     let nearbyLocations
//     try {
//         nearbyLocations = await Location.find({
//             $geoWithin: {
//                 $centerSphere: [[longitude, latitude], 5 / 3963.2] // 5 miles in radian.
//             }
//         })
//     } catch (err) {
//         return res.status(400).json({
//             message: err.message
//         })
//     }

//     return res.status(200).json(nearbyLocations)
// };