const { PORT = 4000, SECRET } = process.env;
const express = require("express")
const middleware = require("./util/middleware")
const tokenService = require('./tokenService')
const app = express()

middleware(app)

tokenService.initialize().then(() => {
    app.listen(PORT, () => console.log('listening'))
})
