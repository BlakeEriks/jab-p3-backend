const got = require('got')
const { getTimePeriods } = require('./dateUtil')

const messariBaseURL = 'https://data.messari.io/api/v1/assets'
const coinApiBaseURL = 'https://rest.coinapi.io/v1/exchangerate'
const {today, dayAgo, weekAgo, monthAgo, yearAgo} = getTimePeriods()

const formatMessariUrl = (token) => {
    return `${messariBaseURL}/${token}/metrics/price/time-series?start=${yearAgo.toISOString()}&end=${today.toISOString()}&interval=1d`
}

const formatCoinApiUrl = (token, start) => {
    return `${coinApiBaseURL}/${token}/USD/history?period_id=8HRS&time_start=${start.toISOString()}&time_end=${today.toISOString()}&apikey=${process.env.COIN_API_KEY}`
}

getTokenHistory = (token, period) => {
    switch (period) {
        case '1Y':
            return got(formatMessariUrl(token))
        case '1M':
            return got(formatCoinApiUrl(token, monthAgo))
        case '1W':
            return got(formatCoinApiUrl(token, weekAgo))
        case '1D':
            return got(formatCoinApiUrl(token, dayAgo))
    }
}

module.exports = getTokenHistory