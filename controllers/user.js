// Dependencies
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireAuth = require("../util/auth");
const { isValidPeriod } = require("../util/dateUtil");
const getPortfolioHistory = require("../util/portfolio");
const {SECRET} = process.env

// Router
const router = express.Router();

// User Routes
router.post("/authenticate", (req, res) => {
    const { username, password } = req.body

    User.findOne({ username }, async (err, user) => {
        if (!user) {
            res.status(400).json(`User not found`)
            return
        }

        const success = await bcrypt.compare(password, user.password)
        if (!success) {
            res.status(400).json('Wrong password')
            return
        }

        const token = jwt.sign({ username }, SECRET);
        res.json({token, username})
    });
});

// create user
router.post("/register", async (req, res) => {

    if (!req.body.password || !req.body.username) {
        res.status(400).json('Invalid parameters')
        return
    }

    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    req.body.portfolio = [{timestamp: new Date(), assets: [], balance: 1000000}]
    User.create(req.body, async (err, user) => {
      
        if (err) {
            res.status(400).json('Username taken')
            return
        }

        const username = user.username
        const token = jwt.sign({username}, SECRET);
        res.json({token, username})
    })
})

router.get("/portfolio/:username", async (req, res) => {

    if (!req.params.username) {
        res.status(400).json('Invalid username')
    }

    User.findOne({username: req.params.username}, (err, user) => {

        if (err || !user) {
            res.status(400).json('User portfolio not found')
            return
        }

        try {
            const portfolio = user.portfolio[user.portfolio.length - 1]
            res.json(portfolio)
        }
        catch (err) {
            res.status(400).json('Error getting user portfolio')
        }
    })
})

router.get("/portfolio/history/:username/:period", async (req, res) => {

    if (!req.params.username || !req.params.period) {
        res.status(400).json('Invalid params')
        return
    }

    if (!isValidPeriod(req.params.period)) {
        res.status(400).json('Invalid period')
        return
    }

    User.findOne({username: req.params.username}, async (err,user) => {
        if (!user) {
            res.status(400).json('Portfolio history not found')
            return
        }
        try {
            const history = await getPortfolioHistory(user.portfolio, req.params.period)
            res.json(history)
        }
        catch (err) {
            console.log(err)
            res.status(400).json('Error getting user history ' + err)
        }
    })
})

router.post("/portfolio/:username", requireAuth, async (req, res) => {

    if (req.payload.username !== req.params.username) {
        res.status(403).json('Not authorized to alter other users portfolio')
        return
    }

    const user = await User.findOne({username: req.params.username})
    if (!user) {
        res.status(400).json('Failed to post to portfolio - portfolio not found for user')
        return
    }

    user.portfolio.push({...req.body, timestamp: new Date()})

    try {
        const portfolio = await User.findByIdAndUpdate(user._id, user, {new: true})
        res.json(portfolio)
    }
    catch (error) {
        res.status(400).json('Failed to update portfolio for user ' + user.username)
    }
})

router.get("/portfolio", async (req,res) => {

    const users = await User.find({})
    res.json(users.map(user => ({username: user.username, portfolio: user.portfolio[user.portfolio.length - 1]})))

})

// export router
module.exports = router