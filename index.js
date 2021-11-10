const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

// set up express server.
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 9000;

//  list all routes here, such as profileRoutes, messageRoutes, etc.
const authRoutes = require("./routes/auth")

// route them accordingly eg. app.use("/profile", profileRoutes)
app.use("/auth", authRoutes);

// basic health endpoint to quickly check if the server is up and running.
app.get('/health', (req, res) => {
    res.status(200).send({
        message: `GET /health on Port ${PORT} successful`
    })
})

// geocoord test endpoint.
const User = require('./models/user')
const Location = require('./models/location')
app.get('/db-test', async (req, res) => {

    let testLocation, testUser
    try {
        testLocation = new Location({
            type: 'Point',
            coordinates: [
                "102",
                "203"
            ]
        })

        await testLocation.save()

        testUser = new User({
            username: "sanya",
            currentLocation: testLocation._id
        })

        await testUser.save();
    } catch (err) {
        res.status(400).json({
            error: err.message
        })
    }

    res.status(200).json({ testLocation, testUser })

})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
    } catch (err) {
        console.log(err);
        console.log("Could not connect to database. Exiting...");
        process.exit(1);
    }
};

connectToDB();
