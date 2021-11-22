///////////////////////
// Dependencies
///////////////////////
// .env variable
require("dotenv").config();
// MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL, SECRET, CLIENT_ORIGIN_URL } = process.env;
// import express
const express = require("express");
const app = express();
// import middleware
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const brcypt = require("bcryptjs");
// import mongoose
const mongoose = require("mongoose");
// routers
const PortfolioRouter = require("./controllers/portfolio");
const UserRouter = require("./controllers/user");
const TokensRouter = require("./controllers/tokens")

const populateCache = require('./startup');

////////////////////////
// Middleware
////////////////////////
app.use(cors())
app.use(morgan("dev"));
app.use(express.json());

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
