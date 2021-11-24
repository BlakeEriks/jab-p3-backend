///////////////////////
// Dependencies
///////////////////////
// .env variable
require("dotenv").config();
// MONGODB_URL from .env
const { PORT = 4000, SECRET } = process.env;
// import express
const express = require("express");
const app = express();
// import middleware
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken")
// routers
const PortfolioRouter = require("../controllers/portfolio");
const UserRouter = require("../controllers/user");
const TokensRouter = require("../controllers/tokens")

////////////////////////
// Middleware Function
////////////////////////
const middleware = app => {
    app.use(cors())
    app.use(morgan("dev"));
    app.use(express.json());
    app.use("/", UserRouter);
    app.use("/", TokenRouter);

    const requireAuth = (req, res, next) => {
        try{
            if(req.headers.token) {
                const token = req.headers.token
                const payload = jwt.verify(token, SECRET);
            if(payload) {
                req.payload = payload;
                next();
            } else {
                res.status(403).json({error: "VERIFICATION FAILED OR NO PAYLOAD"});
            }
            } else {
                res.status(403).json({error: "NO AUTHORIZATION HEADER"});
        }
        } catch (error) {
            console.log(error)
            res.status(403).json({error});
        }
    }
}

// export middleware
module.exports = middleware