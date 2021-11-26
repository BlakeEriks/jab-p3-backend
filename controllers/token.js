// Dependencies
const express = require("express")
const tokenService = require('../tokenService')

// Router
const router = express.Router()

// Tokens Routes
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
