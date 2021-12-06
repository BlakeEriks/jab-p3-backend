const Token = require("../models/token")

var isStale = true
var tokenCache = []
var lastSync = new Date()

const get = async () => {
    if (new Date().getTime() - lastSync.getTime() > 600000) {
        isStale = true
    }

    if (isStale) {
        console.log('Fetching fresh cache')
        tokenCache = await Token.find({})
        lastSync = new Date()
        isStale = false
    }
    return tokenCache
}

const invalidateCache = () => {
    isStale = true
}

module.exports = {get, invalidateCache}