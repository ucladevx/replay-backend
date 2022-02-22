const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const { URLSearchParams } = require("url");
const querystring = require("querystring");
const request = require('request')

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

exports.spotify = async (req, res) => {

    const client_id = process.env.SPOTIFY_CLIENT_ID
    const response_type = "code"
    const show_dialog = true // change to false later.
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI

    let state = process.env.SPOTIFY_STATE

    // https://developer.spotify.com/documentation/general/guides/authorization/scopes
    let scope = 'user-read-playback-state user-read-recently-played user-read-currently-playing user-read-private user-follow-read user-library-read user-read-email playlist-read-collaborative user-top-read';

    const auth_str = 'https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type,
            client_id,
            scope,
            redirect_uri,
            state,
            show_dialog,
        }).toString()
    console.log(auth_str)

    try {
        res.redirect(auth_str);
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }


}

exports.callback = async (req, res) => {
    console.log('Callback successful')

    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI
    const client_id = process.env.SPOTIFY_CLIENT_ID
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
    }

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            console.log(body)

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                console.log(body);
            });

            // we can also pass the token to the browser to make requests from there
            res.redirect('/#' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } else {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    });
}

exports.refreshToken = async (req, res) => {

    const client_id = process.env.SPOTIFY_CLIENT_ID
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    try {
        await request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;

                res.status(200).json({
                    access_token,
                    message: 'Successful.'
                })
            }
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
};