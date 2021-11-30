const tokenUtil = require('./util/tokenUtil')

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const populateCache = async (cache) => {

    const useStaticData = false
    await initializeCache(cache)

    for (let index = 0; index < cache.length; index++) {
    // await cache.forEach( async (token, index) => {
        const token = cache[index]
        let tokenHistoryData = {year : {interval: 172800000, values: []},
                            sixMonths : {interval: 86400000, values: []}, 
                            threeMonths : {interval: 43200000, values: []},
                            month : {interval: 28800000, values: []}, 
                            week : {interval: 7200000, values: []},
                            day : {interval: 900000, values: []}}

        for ( [interval, data] of Object.entries(tokenHistoryData) ) {
            data.values = await tokenUtil.getTokenHistoryData(token.symbol, interval, useStaticData)
            await sleep(2000)
        }
        
        cache[index].history = tokenHistoryData
    }//)
}

const runCacheUpdateWorker = (cache, period) => {
    const PERIOD_IN_MILLIS = period * 60 * 1000

    updateCache(cache)
    setInterval( () => {
        console.log('updating token cache...')
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
    const tokenData = await tokenUtil.getCurrentTokenPrices()

    /* Static call to local data */
    // const body = require('./data/tokenPrices')

    const timestamp = new Date()

    tokenData.forEach( (token,index) => { // for each token in body.data
    // const data = tokenData[0] /* static data testing btc, REMOVE THIS WHEN GOING LIVE */
        const newPrice = token.metrics.market_data.price_usd.toFixed(2)
        cache[index].price = newPrice
        cache[index].percentChange = token.metrics.market_data.percent_change_usd_last_24_hours.toFixed(2)
        for ( const [period, tokenHistory] of Object.entries(cache[index].history)) {
            const latest = new Date(tokenHistory.values[tokenHistory.values.length - 1].timestamp)
            const deltaTime = timestamp - latest
            if (deltaTime >= tokenHistory.interval) {
                const newDate = new Date(latest.getTime() + tokenHistory.interval)
                tokenHistory.values.push({timestamp: newDate, price: newPrice})
                tokenHistory.values.shift()
                console.log(`Added new value to ${token.slug} ${period} history data`)
            }
        }
    })
    
}

module.exports = {populateCache, runCacheUpdateWorker, updateCache}