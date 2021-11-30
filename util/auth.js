const jwt = require("jsonwebtoken")

const requireAuth = (req, res, next) => {
    try{
        if(req.headers.token) {
            const token = req.headers.token
            const payload = jwt.verify(token, SECRET);
        if(payload) {
            req.payload = payload;
            next();
        } else {
            res.status(403).json({error: "VERIFICATION FAILED OR NO PAYLOAD"});
        }
        } else {
            res.status(403).json({error: "NO AUTHORIZATION HEADER"});
    }
    } catch (error) {
        console.log(error)
        res.status(403).json({error});
    }
}

module.exports = requireAuth