const request = require('request')

exports.recentlyPlayed = async (req, res) => {

    // const redirect_uri = process.env.SPOTIFY_REDIRECT_URI
    // const client_id = process.env.SPOTIFY_CLIENT_ID

    const token = req.headers.authorization.split(" ")[1];

    var requestOptions = {
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`,
        },
        json: true
    };

    console.log(requestOptions)

    try {
        await request.get(requestOptions, function (error, response, body) {
            console.log('body:', body)
            if (!error && response.statusCode === 200) {
                return res.status(200).json({
                    body,
                })
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
};

exports.topArtistsOrTracks = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { type } = req.query

    var requestOptions = {
        url: 'https://api.spotify.com/v1/me/top/' + type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + `${token}`,
        },
        json: true
    };

    console.log(requestOptions)

    try {
        await request.get(requestOptions, function (error, response, body) {
            console.log('body:', body)
            if (!error && response.statusCode === 200) {
                return res.status(200).json({
                    body,
                })
            }
        })
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}