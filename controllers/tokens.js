// Dependencies
const express = require("express")
const tokenService = require('../tokenService')
const { PORT = 4000, MONGODB_URL, SECRET, CLIENT_ORIGIN_URL } = process.env;
const app = express();

// Router
const router = express.Router()

// Tokens Routes
router.get('/', (req, res) => {
    res.json('hello world')
})

router.get('/tokens/prices', async (req,res) => {
    res.json(await tokenService.getAllPrices())
})

router.get('/tokens/prices/:token', async (req,res) => {
    res.json(await tokenService.getPrice(req.params.token))
})

router.get('/tokens/history/:token/:period', async (req,res) => {
    res.json(await tokenService.getPriceHistory(req.params.token, req.params.period))
})

// export router
module.exports = router;
