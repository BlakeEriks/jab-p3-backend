const tokenUtil = require('./util/tokenUtil')

const populateCache = async (cache) => {

    const useStaticData = true
    await initializeCache(cache)

    // for (token of tokens) { for each token we care about
        let token = 'BTC'
        tokenHistoryData = {year : {interval: 172800000, values: []},
                            sixMonths : {interval: 86400000, values: []}, 
                            threeMonths : {interval: 43200000, values: []},
                            month : {interval: 28800000, values: []}, 
                            week : {interval: 7200000, values: []},
                            day : {interval: 900000, values: []}}

        for ( [interval, data] of Object.entries(tokenHistoryData) ) {
            data.values = await tokenUtil.getTokenHistoryData(token, interval, useStaticData)
        }

        cache[0].history = tokenHistoryData
    // } end for loop
}

const runCacheUpdateWorker = (cache, period) => {
    const PERIOD_IN_MILLIS = period * 60 * 1000
    updateCache(cache)
    setInterval( () => {
        updateCache(cache)
    }, PERIOD_IN_MILLIS)
}

const initializeCache = async cache => {
    
    /* Live Call */
    const tokenData = await tokenUtil.getCurrentTokenPrices()

    /* Static call to data */
    // const body = require('./data/tokenPrices')

    for (token of tokenData) {
        cache.push({
            name: token.slug, 
            symbol: token.symbol, 
            price: token.metrics.market_data.price_usd.toFixed(2),
            percentChange: token.metrics.market_data.percent_change_usd_last_24_hours.toFixed(2)
        })
    }
}

const updateCache = async (cache) => {

    /* Live Call */
    // const tokenData = await tokenUtil.getCurrentTokenPrices()

    /* Static call to local data */
    const body = require('./data/tokenPrices')

    const timestamp = new Date()

    // for ( (token, index) of tokenData) { for each token in body.data
    const data = body.data[0] /* static data testing btc, REMOVE THIS WHEN GOING LIVE */
        const newPrice = data.metrics.market_data.price_usd.toFixed(2)
        cache[0].price = newPrice /* Change all 0's to 1's when going live */
        cache[0].percentChange = token.metrics.market_data.percent_change_usd_last_24_hours.toFixed(2)
        for ( const[period, tokenHistory] of Object.entries(cache[0].history)) {
            const latest = new Date(tokenHistory.values[tokenHistory.values.length - 1].timestamp)
            const deltaTime = timestamp - latest
            if (deltaTime >= tokenHistory.interval) {
                const newDate = new Date(latest.getTime() + tokenHistory.interval)
                tokenHistory.values.push({timestamp: newDate, price: newPrice})
            }
        }
    // }
    
}

module.exports = {populateCache, runCacheUpdateWorker, updateCache}