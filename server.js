///////////////////////
// Dependencies
///////////////////////
// .env variable
require("dotenv").config();
// MONGODB_URL from .env
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
const app = express();
// import middleware
const cors = require("cors");
const morgan = require("morgan");
// import mongoose
const mongoose = require("mongoose");
// install session
const session = require("express-session");
const brcypt = require("bcryptjs");
// routers
const PortfolioRouter = require("./controllers/portfolio");
const UserRouter = require("./controllers/user");



////////////////////////
// Middleware
////////////////////////
app.use(cors({credentials: true, origin: process.env.CLIENT_ORIGIN_URL}));
app.use(morgan("dev"));
app.use(express.json());



///////////////////////
// Routes
///////////////////////

///////////////////////
// Portfolio Routes
///////////////////////

///////////////////////
// User Routes
///////////////////////




// Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));