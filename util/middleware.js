require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const UserRouter = require("../controllers/user")
const TokenRouter = require("../controllers/token")

const middleware = app => {
    app.use(cors())
    app.use(morgan("dev"))
    app.use(express.json())
    app.use("/", UserRouter)
    app.use("/", TokenRouter)
}

module.exports = middleware