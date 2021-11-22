require('dotenv').config()
const { PORT = 4000, MONGODB_URL, SECRET, CLIENT_ORIGIN_URL } = process.env;
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const tokenService = require('./tokenService')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('short'))

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