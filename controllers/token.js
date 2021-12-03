// Dependencies
const express = require("express");
const jobService = require("../jobService");
const Token = require("../models/token");

// Router
const router = express.Router()

// Tokens Routes
router.get('/initialize', async (req,res) => {
    await jobService.init()
    res.json('Finished initialization')
})

router.get('/update', async (req,res) => {
    await jobService.update()
    res.json('Finished updating')
})

router.get('/tokens', async (req,res) => {
    Token.find({}, 'name symbol price percentChange', (err, tokens) => {
        if (err || !tokens) {
            res.status(400).json('Token not found')
            return
        }
        res.json(tokens)
    })
})

router.get('/tokens/prices/:token', async (req,res) => {
    Token.find({name: req.params.token}, 'name symbol price percentChange', (err, token) => {
        if (err || !token) {
            res.status(400).json('Token not found')
            return
        }
        res.json(token)
    })
})

router.get('/tokens/history', async (req,res) => {
    Token.find({}, (err, tokens) => {
        if (err || !tokens) {
            res.status(400).json('Tokens history not found')
            return
        }
        res.json(tokens.map(token => ({symbol: token.symbol, history: token.history})))
    })
})

router.get('/tokens/history/:token', async (req,res) => {
    Token.findOne({symbol: req.params.token}, (err, token) => {
        if (err || !token) {
            res.status(400).json('Token history not found')
            return
        }
        res.json(token.history)
    })
})

router.get('/tokens/history/:token/:period', async (req,res) => {
    Token.findOne({symbol: req.params.token}, (err, token) => {
        if (err || !token) {
            res.status(400).json('Token history not found')
            return
        }
        const history = token.history.find(hist => hist.period === req.params.period)
        if (!history) {
            res.status(400).json('Not a valid period')
            return
        }
        res.json(history)
    })
})

module.exports = router;
