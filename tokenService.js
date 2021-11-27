const {populateCache, runCacheUpdateWorker} = require("./cache")
const constructPortfolioHistoryData = require("./util/portfolio")

const tokenCache = []
const UPDATE_PERIOD_IN_MINUTES = 5

const tokenService = {

    initialize: async () => {
        await populateCache(tokenCache)
        // runCacheUpdateWorker(tokenCache, UPDATE_PERIOD_IN_MINUTES)
    },

    getAllPrices: () => {
        return tokenCache.map(token => ({name: token.name, symbol: token.symbol, price: token.price, percentChange: token.percentChange}))
    },

    getPrice: symbol => {
        const token = tokenCache.find( item => item.symbol === symbol)
        return {name: token.name, token: token.symbol, price: token.price}
    },

    getPriceHistory: (symbol, period) => {
        const token = tokenCache.find( item => item.symbol === symbol)
        return token.history[period]
    },

    getPortfolioPriceHistory: (portfolio, period) => {
        return constructPortfolioHistoryData(tokenCache, portfolio, period)
    }
}

module.exports = tokenService