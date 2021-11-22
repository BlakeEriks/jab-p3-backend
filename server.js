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

const populateCache = require('./startup');
const tokenService = require('./tokenService')

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

app.get('/', (req, res) => {
    res.json('hello world')
})

app.get('/tokens/prices', async (req,res) => {
    res.json(await tokenService.getAllPrices())
})

app.get('/tokens/prices/:token', async (req,res) => {
    res.json(await tokenService.getPrice(req.params.token))
})

app.get('/tokens/history/:token/:period', async (req,res) => {
    res.json(await tokenService.getPriceHistory(req.params.token, req.params.period))
})

tokenService.initialize().then(() => {
    app.listen(PORT, () => console.log('listening'))
})
