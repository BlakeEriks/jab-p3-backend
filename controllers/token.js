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
    try {
        res.json(await tokenService.getPrice(req.params.token))
    }
    catch (err) {
        res.status(400).json('Error getting token price')
    }
})

router.get('/tokens/history/:token/:period', async (req,res) => {
    const tokenHistory = await tokenService.getPriceHistory(req.params.token, req.params.period)
    if (!tokenHistory) {
        res.status(400).json('Error getting token history for ' + req.params.token)
        return
    }
    res.json(tokenHistory)
})

module.exports = router;
