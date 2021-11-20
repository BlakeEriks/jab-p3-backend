require('dotenv').config()
const { PORT = 4000, MONGODB_URL, SECRET, CLIENT_ORIGIN_URL } = process.env;
const express = require('express')
const morgan = require('morgan');
const populateCache = require('./startup');
const tokenService = require('./tokenService')

const app = express()

app.use(express.json())

populateCache().then(() => {
    app.listen(PORT, () => console.log('listening'))
})