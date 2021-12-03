const Token = require('./models/token');
const { getTokenHistoryData, getCurrentTokenPrices } = require('./util/tokenApiUtil');

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const initDB = async () => {

    const useStaticData = true
    await Token.deleteMany({})
    const tokenData = await tokenUtil.getCurrentTokenPrices()

    for (const token of tokenData) {
        
        const historyData = [
            {period: 'year', interval: 172800000, data: []},
            {period: 'sixMonths', interval: 86400000, data: []}, 
            {period: 'threeMonths', interval: 43200000, data: []},
            {period: 'month', interval: 28800000, data: []}, 
            {period: 'week', interval: 7200000, data: []},
            {period: 'day', interval: 900000, data: []}
        ]

        for ( const history of historyData ) {
            history.data = await getTokenHistoryData(token.symbol, history.period, useStaticData)
            if (!useStaticData) await sleep(6000)
        }

        await Token.create({
            name: token.slug, 
            symbol: token.symbol, 
            price: token.metrics.market_data.price_usd.toFixed(2),
            percentChange: token.metrics.market_data.percent_change_usd_last_24_hours.toFixed(2),
            history: historyData
        })
    }
}

const updateDB = async () => {

    const tokenData = await getCurrentTokenPrices()
    const timestamp = new Date()
    const dbTokens = await Token.find({})

    for (const token of tokenData) {

        const dbToken = dbTokens.find(dbToken => dbToken.symbol === token.symbol)
        
        if (dbToken) {
            const newPrice = token.metrics.market_data.price_usd.toFixed(2)
            dbToken.price = newPrice
            dbToken.percentChange = token.metrics.market_data.percent_change_usd_last_24_hours.toFixed(2)
            for ( history of dbToken.history ) {
                const latest = new Date(history.data[history.data.length - 1].timestamp)
                const deltaTime = timestamp - latest
                if (deltaTime >= history.interval) {
                    const newDate = new Date(latest.getTime() + history.interval)
                    history.data.push({timestamp: newDate, value: newPrice})
                    history.data.shift()
                    console.log(`Added new value to ${token.slug} ${history.period} history data`)
                }
            }
            await Token.findByIdAndUpdate(dbToken._id, dbToken, {new: true})
        }
    }
}

module.exports = {initDB, updateDB}
