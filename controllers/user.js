// Dependencies
const express = require("express");
const User = require("../models/user");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

        const success = await bcyypt.compare(password, user?.password)
        if (!success) {
            res.status(400).json('Wrong password')
            return
        }

        const token = await jwt.sign({ username }, SECRET);
        res.json({token, username})
    });
});

// create user
router.post("/register", (req, res) => {
    req.body.password = await brcypt.hash(req.body.password, await brcypt.genSalt(10))

    User.create(req.body, (err, user) => {
        if (err) {
            res.status(400).json('Username taken')
            return
        }

        const username = user.username
        const token = jwt.sign({username: username}, SECRET);
        res.json({token, username})
    })
})

// log out
router.get("/logout", async (req, res) => {
    jwt.destroy( err => {
        if (!err) res.json('Logged out')
    })
})


// export router
module.exports = router