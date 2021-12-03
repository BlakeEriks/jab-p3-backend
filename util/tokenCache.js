const Token = require("../models/token")

var isStale = true
var tokenCache = []

const get = async () => {
    if (isStale) {
        console.log('Fetching fresh cache')
        tokenCache = await Token.find({})
        isStale = false
    }
    return tokenCache
}

const invalidateCache = () => {
    isStale = true
}

module.exports = {get, invalidateCache}