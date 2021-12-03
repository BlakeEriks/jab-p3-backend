const getTimePeriods = () => {
    const today = new Date()
    const yearAgo = new Date(today), sixMonthsAgo = new Date(today), threeMonthsAgo = new Date(today), monthAgo = new Date(today), weekAgo = new Date(today), dayAgo = new Date(today)
    yearAgo.setFullYear(today.getFullYear() - 1)
    sixMonthsAgo.setMonth(today.getMonth() - 6)
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    monthAgo.setMonth(today.getMonth() - 1)
    weekAgo.setDate(today.getDate() - 7)
    dayAgo.setDate(today.getDate() - 1)

    const getStartDate = period => {
        const date = new Date()
        if (period === 'year') {
            date.setFullYear(today.getFullYear() - 1)
        }
        if (period === 'sixMonths') {
            date.setMonth(today.getMonth() - 6)
        }
        if (period === 'threeMonths') {
            date.setMonth(today.getMonth() - 3)
        }
        if (period === 'month') {
            date.setMonth(today.getMonth() - 1)
        }
        if (period === 'week') {
            date.setDate(today.getDate() - 7)
        }
        if (period === 'day') {
            date.setDate(today.getDate() - 1)
        }
        return date
    }

    return {today, dayAgo, weekAgo, monthAgo, threeMonthsAgo, sixMonthsAgo, yearAgo, getStartDate}
}

const isValidPeriod = period => {
    return  period === 'year' || 
            period === 'sixMonths' || 
            period === 'threeMonths' || 
            period === 'month' ||
            period === 'week' ||
            period === 'day'
}

module.exports = {getTimePeriods, isValidPeriod}