// Dependencies
const mongoose = require("mongoose")
require("dotenv").config()

// Database Connection
const MONGODB_URL = process.env.MONGODB_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(MONGODB_URL, CONFIG)

mongoose.connection
.on("open", () => console.log("connected to mongo"))
.on("close", () => console.log("disconnected from mongo"))
.on("error", (error) => console.log(error))

module.exports = mongoose