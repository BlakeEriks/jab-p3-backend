const got = require('got')
const { getTimePeriods } = require('./dateUtil')

const messariBaseURL = 'https://data.messari.io/api/v1/assets'
const coinApiBaseURL = 'https://rest.coinapi.io/v1/exchangerate'
const {today, dayAgo, weekAgo, monthAgo, yearAgo} = getTimePeriods()

const formatMessariUrl = (token) => {
    return !!token ? `${messariBaseURL}/${token}/metrics/price/time-series?start=${yearAgo.toISOString()}&end=${today.toISOString()}&interval=1d`
        : `${messariBaseURL}?fields=slug,symbol,metrics/market_data/price_usd`
}

const formatCoinApiUrl = (token, start) => {
    return `${coinApiBaseURL}/${token}/USD/history?period_id=8HRS&time_start=${start.toISOString()}&time_end=${today.toISOString()}&apikey=${process.env.COIN_API_KEY}`
}

const getStaticDataForPeriod = period => {
    if (period === 'year') return require('../data/btc1y')
    if (period === 'month') return require('../data/btc1m')
    if (period === 'week') return require('../data/btc1w')
    if (period === 'day') return require('../data/btc1d')
    return null
}

getTokenHistoryData = async (token, period, useStaticData) => {

    let useMessari = false
    let url = ''

    if (period === 'year') {
        url = formatMessariUrl(token)
        useMessari = true
    }
    if (period === 'month') formatCoinApiUrl(token, monthAgo)
    if (period === 'week') formatCoinApiUrl(token, weekAgo)
    if (period === 'day') formatCoinApiUrl(token, dayAgo)

    let body = {}

    if (useStaticData) {
        body = getStaticDataForPeriod(period)
    }
    else {
        const response = useStaticData ? {} : await got(url)
        body = JSON.parse(response.body)
    }
    
    if (useMessari) {
        return body.data.values.map( value => ({timestamp: new Date(value[0]), price: value[1].toFixed(2)}))
    }
    else {
        return body.map( value => ({timestamp: new Date(value.time_period_start), price: value.rate_open.toFixed(2)}))
    }

}

getCurrentTokenPrices = async () => {
    const response = await got(formatMessariUrl())
    return JSON.parse(response.body)
}

module.exports = {getTokenHistoryData, getCurrentTokenPrices}