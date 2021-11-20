const {getUTCDateFromEpoch} = require('./util/dateUtil')
const getTokenHistory = require('./util/tokenUtil')

const populateCache = async () => {

    let cache = {}

    // for (token of tokens) { for each token we care about
        let token = 'BTC'
        tokenHistoryData = {year : {timeInterval: '1D', values: []}, 
                            month : {timeInterval: '8HR', values: []}, 
                            week : {timeInterval: '2HR', values: []},
                            day : {timeInterval: '15M', values: []}}

        /* Queries from Messari - 1Y on 1d interval */

        /* LIVE QUERIES */
        // let response = await getTokenHistory(token, '1Y')
        // let body = JSON.parse(response.body)

        /* STATIC DATA */
        let body = require('./data/btc1y')

        for (value of body.data.values) {
            tokenHistoryData.year.values.push({timestamp: getUTCDateFromEpoch(value[0]), price: value[1]})
        }

        /* Query to CoinAPI - 1M at 8hr interval */

        /* LIVE QUERIES */
        // response = await getTokenHistory(token, '1M')
        // let body = JSON.parse(response.body)

        /* STATIC DATA */
        body = require('./data/btc1m')   

        for (value of body) {
            tokenHistoryData.month.values.push({timestamp: new Date(value.time_period_start), price: value.rate_open})
        }

        /* Query to CoinAPI - 1w at 2hr interval */

        /* LIVE QUERIES */
        // response = await getTokenHistory(token, '1W')
        // let body = JSON.parse(response.body)

        /* STATIC DATA */
        body = require('./data/btc1w')   

        for (value of body) {
            tokenHistoryData.week.values.push({timestamp: new Date(value.time_period_start), price: value.rate_open})
        }

        /* Query to CoinAPI - 1d at 15min interval */

        /* LIVE QUERIES */
        // response = await getTokenHistory(token, '1D')
        // let body = JSON.parse(response.body)

        /* STATIC DATA */
        body = require('./data/btc1d')   

        for (value of body) {
            tokenHistoryData.day.values.push({timestamp: new Date(value.time_period_start), price: value.rate_open})
        }

        cache[token] = tokenHistoryData
    // } end for loop

    return cache
}

module.exports = populateCache