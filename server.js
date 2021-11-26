const { PORT = 4000, SECRET } = process.env;
const express = require("express")
// import express
const express = require("express");
const app = express();
// routers
const UserRouter = require("./controllers/user");
const TokenRouter = require("./controllers/token")
const tokenService = require('./tokenService')
const middleware = require("./util/middleware")
const tokenService = require('./tokenService')
const app = express()

middleware(app)

tokenService.initialize().then(() => {
    app.listen(PORT, () => console.log('listening'))
})
