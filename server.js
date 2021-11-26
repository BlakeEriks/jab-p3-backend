// MONGODB_URL from .env
const { PORT = 4000, SECRET } = process.env;
// import express
const express = require("express");
const app = express();
// routers
const UserRouter = require("./controllers/user");
const TokenRouter = require("./controllers/token")
const tokenService = require('./tokenService')
const middleware = require("./util/middleware")


tokenService.initialize().then(() => {
    app.listen(PORT, () => console.log('listening'))
})
