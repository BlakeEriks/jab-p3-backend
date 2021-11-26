// Dependencies
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {SECRET} = process.env

// Router
const router = express.Router();

// User Routes
// gets us the user
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

    User.findOne({username: req.params.username}, (err, user) => {

        if (err || !user) {
            res.status(400).json('User portfolio not found')
            return
        }

        res.json(user.portfolio[user.portfolio.length - 1])

    })
})

router.get("/portfolio/history/:username", async (req, res) => {

    User.findOne({username: req.params.username}, (err, user) => {

        if (err || !user) {
            res.status(400).json('User portfolio not found')
            return
        }

        res.json(user.portfolio)

    })
})

router.post("/portfolio/:username", async (req, res) => {

    const user = await User.findOne({username: req.params.username})
    user.portfolio.push({...req.body, timestamp: new Date()})
    console.log(user)
    try {
        res.json(await User.findByIdAndUpdate(user._id, user, {new: true}))
    }
    catch (error) {
        res.status(400).json({error})
    }
})

// export router
module.exports = router