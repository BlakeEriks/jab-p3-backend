const { getTimePeriods } = require("./dateUtil")
const tokenCache = require('./tokenCache')

const getInterval = period => {
    if( period === 'year') { 
        return 172800000
    }
    if( period === 'sixMonths') { 
        return 86400000
    } 
    if( period === 'threeMonths') { 
        return 43200000
    }
    if( period === 'month') { 
        return 28800000
    }
    if( period === 'week') { 
        return 7200000
    }
    if( period === 'day') { 
        return 900000
    }
}

const calculateAssetsValue = async (assets, date, interval, period) => {
    const tokenData = await tokenCache.get()
    let value = 0
    for (const asset of assets) {
        const token = tokenData.find( token => token.symbol === asset.symbol)
        if (!token) continue
        const historyData = token.history.find( hist => hist.period === period)
        const highDate = new Date(date.getTime() + interval)
        const lowDate = new Date(date.getTime() - interval)
        const historyToken = historyData.data.find(value => new Date(value.timestamp) >= lowDate && new Date(value.timestamp) <= highDate)
        if (!historyToken) {
            console.log('no data between ' + lowDate.toISOString() +' and ' + highDate.toISOString() +' for ' + token.symbol)
        }
        else value += historyToken.value * asset.quantity
    }
    return value
}

const getPortfolioHistory = async (portfolio, period) => {
    const {today, getStartDate} = getTimePeriods()
    const startDate = getStartDate(period)
    const interval = getInterval(period)

    const historyData = []
    let curDate = today

    while (curDate >= startDate) {

        let curPortfolio = portfolio[portfolio.length - 1]
        let curValue = 0

        while (curDate < new Date(curPortfolio.timestamp)) {
            if (portfolio.length == 1) break
            portfolio.pop()
            curPortfolio = portfolio[portfolio.length - 1]
        }
        
        curValue = curPortfolio.balance + await calculateAssetsValue(curPortfolio.assets, curDate, interval, period)
        historyData.push({timestamp: curDate, value: curValue.toFixed(2)})
        curDate = new Date(curDate.getTime() - interval)
    }
    return {interval, data: historyData}
}

module.exports = getPortfolioHistory