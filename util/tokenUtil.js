const got = require('got')
const { getTimePeriods } = require('./dateUtil')

const messariBaseURL = 'https://data.messari.io/api/v1/assets'
const coinApiBaseURL = 'https://rest.coinapi.io/v1/exchangerate'
const {today, dayAgo, weekAgo, monthAgo, threeMonthsAgo, sixMonthsAgo, yearAgo} = getTimePeriods()
const messariPeriods = ['year', 'sixMonths', 'threeMonths']

const formatMessariUrl = (token, period) => {
    return !!token ? `${messariBaseURL}/${token}/metrics/price/time-series?start=${period.toISOString()}&end=${today.toISOString()}&interval=1d`
        : `${messariBaseURL}?fields=slug,symbol,metrics/market_data/price_usd`
}

const formatCoinApiUrl = (token, start, period) => {
    return `${coinApiBaseURL}/${token}/USD/history?period_id=${period}&time_start=${start.toISOString()}&time_end=${today.toISOString()}&apikey=${process.env.COIN_API_KEY}`
}

const getStaticDataForPeriod = period => {
    if (period === 'year') return require('../data/btc1y')
    if (period === 'sixMonths') return require('../data/btc6m')
    if (period === 'threeMonths') return require('../data/btc3m')
    if (period === 'month') return require('../data/btc1m')
    if (period === 'week') return require('../data/btc1w')
    if (period === 'day') return require('../data/btc1d')
}

getTokenHistoryData = async (token, period, useStaticData) => {

    let useMessari = messariPeriods.includes(period)
    let url = ''

    if (period === 'year') url = formatMessariUrl(token, yearAgo)
    if (period === 'sixMonths') url = formatMessariUrl(token, sixMonthsAgo)
    if (period === 'threeMonths') url = formatMessariUrl(token, threeMonthsAgo)
    if (period === 'month') url = formatCoinApiUrl(token, monthAgo, '8HRS')
    if (period === 'week') url = formatCoinApiUrl(token, weekAgo, '2HRS')
    if (period === 'day') url = formatCoinApiUrl(token, dayAgo, '15MIN')

    let body = {}

    if (useStaticData) {
        body = getStaticDataForPeriod(period)
    }
    else {
        const response = useStaticData ? {} : await got(url)
        body = JSON.parse(response.body)
    }

    if (useMessari) {
        let values = body.data.values.map( value => ({timestamp: new Date(value[0]), value: value[1].toFixed(2)}))
        if (period == 'year') values = values.filter( (v,i) => (i % 2) === 0) /* Remove every other entry from year data to get desired period */
        return values
    }
    else {
        return body.map( value => ({timestamp: new Date(value.time_period_start), value: value.rate_open.toFixed(2)}))
    }

}

getCurrentTokenPrices = async () => {
    const response = await got(formatMessariUrl())
    return JSON.parse(response.body)
}

module.exports = {getTokenHistoryData, getCurrentTokenPrices}