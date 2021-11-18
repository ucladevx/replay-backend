const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user")

exports.signUp = async (req, res) => {

    const { username, email, password } = req.body;

    if (username === undefined || email === undefined || password === undefined) {
        return res.status(400).json({
            message: "Please provide username, email, and password."
        })
    }
    // More password and email validation later.

    // Hash password with Bcrypt.
    let hashedPassword = await bcrypt.hashSync(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword,
        spotifyUsername: "",
        currentLocation: "",
        songsPlayed: [],
        topArtists: [],
        promptAnswers: [],
        dp: ""
    })

    // Create JWT for client.
    let JWT = jwt.sign({ id: user._id, username, email }, req.app.get("jwt_secret"), { expiresIn: 8640000 })

    try {
        await user.save()
    } catch (err) {
        if (err.message.includes("duplicate") && err.message.includes("username")) {
            return res.status(400).json({
                message: "An account with that username already exists. Sign in, or use a different username to sign up.",
            });
        } else if (err.message.includes("duplicate") && err.message.includes("email")) {
            return res.status(400).json({
                message:
                    "An account with that email already exists. Sign in, or use a different email to sign up.",
            });
        }

        return res.status(400).json({
            message: err.message
        });
    }

    return res.status(400).json({
        message: "Sign up successful.",
        token: JWT
    })
};

exports.signIn = async (req, res) => {

    const { email, username, password } = req.body;

    if (password === undefined)
        return res.status(401).json({
            message: "Password required."
        })

    if ((email === undefined || email === "") && (username === undefined || username === ""))
        return res.status(401).json({
            message: "Email or username required to sign in."
        })

    let user;

    try {
        if (email) {
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ username });
        }

        if (!user) {
            res.status(401).json({
                message: "User not found."
            })
        }

        // Check password and return new JWT.
        if (await bcrypt.compare(password, user.password)) {
            const JWT = jwt.sign({ id: user._id, username, email }, req.app.get("jwt_secret"), { expiresIn: 8640000 })
            return res.status(200).json({
                message: "Sign in successful.",
                token: JWT
            })
        } else {
            return res.status(401).json({
                message: "Password incorrect."
            })
        }
    } catch (err) {
        return res.status(401).json({
            message: err.message
        })
    }
}