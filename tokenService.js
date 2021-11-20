const {populateCache, runCacheUpdateWorker} = require("./cache")

const tokenCache = []
const UPDATE_PERIOD_IN_MINUTES = 5

const tokenService = {

    initialize: async () => {
        await populateCache(tokenCache)
        // runCacheUpdateWorker(tokenCache, UPDATE_PERIOD_IN_MINUTES)
    },

    getAllPrices: () => {
        return tokenCache.map(token => ({name: token.name, token: token.symbol, price: token.price}))
    },

    getPrice: symbol => {
        const token = tokenCache.find( item => item.symbol === symbol)
        return {name: token.name, token: token.symbol, price: token.price}
    },

    getPriceHistory: (symbol, period) => {
        const token = tokenCache.find( item => item.symbol === symbol)
        return token.history[period]
    }
}

module.exports = tokenService