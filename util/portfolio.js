const { getTimePeriods } = require("./dateUtil")

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

const calculateAssetsValue = (tokenCache, assets, date, interval, period) => {
    let value = 0
    for (const asset of assets) { // {symbol}
        const token = tokenCache.find( token => token.symbol === asset.symbol)
        const historyData = token.history[period].values
        const highDate = new Date(date.getTime() + interval)
        const lowDate = new Date(date.getTime() - interval)
        const historyToken = historyData.find(value => new Date(value.timestamp) >= lowDate && new Date(value.timestamp) <= highDate)
        if (!historyToken) value = 0
        else value += historyToken.value * asset.quantity
    }
    return value
}

const constructPortfolioHistoryData = (tokenCache, portfolio, period) => {
    const {today, getStartDate} = getTimePeriods()
    const startDate = getStartDate(period)
    const interval = getInterval(period)

    const historyData = []
    let curDate = today

    while (curDate >= startDate) {

        let curPortfolio = portfolio[portfolio.length - 1]
        let curValue = 0

        while (curDate < new Date(curPortfolio.timestamp)) {
            if (portfolio.length > 1) {
                portfolio.pop()
                curPortfolio = portfolio[portfolio.length - 1]
            }
            else {
                break
            }
        }
        
        curValue = curPortfolio.balance + calculateAssetsValue(tokenCache, curPortfolio.assets, curDate, interval, period)
        historyData.push({timestamp: curDate, value: curValue.toFixed(2)})
        curDate = new Date(curDate.getTime() - interval)
    }
    return {interval, values: historyData}
}

module.exports = constructPortfolioHistoryData