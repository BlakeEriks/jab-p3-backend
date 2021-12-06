// Dependencies
const express = require("express");
const Token = require("../models/token");

// Router
const router = express.Router()

router.get('/tokens', async (req,res) => {
    Token.find({}, 'name symbol price percentChange', (err, tokens) => {
        if (err || !tokens) {
            res.status(400).json('Token not found')
            return
        }
        res.json(tokens)
    })
})

router.get('/tokens/history', async (req,res) => {
    console.log('in all history')
    Token.find({}, (err, tokens) => {
        if (err || !tokens) {
            res.status(400).json('Tokens history not found')
            return
        }
        console.log(tokens)
        res.json(tokens.map(token => ({symbol: token.symbol, history: token.history})))
    })
})

router.get('/tokens/:token', async (req,res) => {
    Token.findOne({symbol: req.params.token}, 'name symbol price percentChange', (err, token) => {
        if (err || !token) {
            res.status(400).json('Token not found')
            return
        }
        res.json(token)
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
