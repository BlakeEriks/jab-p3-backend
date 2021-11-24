// Dependencies
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Portfolio = require("../models/portfolio");
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
    User.create(req.body, async (err, user) => {
      
        if (err) {
            res.status(400).json('Username taken')
            return
        }
        /* Initialize User Porfolio */
        const portfolio = {user_id: user._id, assets: [], balance: 1000000}
        await Portfolio.create(portfolio)

        const username = user.username
        const token = jwt.sign({username}, SECRET);
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