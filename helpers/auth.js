const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// TODO: implement.
exports.signUp = async (req, res) => {
    console.log("Sign Up request received.");

    return res.status(200).json({
        message: "Sign Up request received."
    })
};

// TODO: implement.
exports.signIn = async (req, res) => {
    console.log("Sign In request received.");

    return res.status(200).json({
        message: "Sign In request received."
    })
}