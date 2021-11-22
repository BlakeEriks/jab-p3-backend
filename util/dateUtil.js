const getTimePeriods = () => {
    const today = new Date()
    const yearAgo = new Date(today), sixMonthsAgo = new Date(today), threeMonthsAgo = new Date(today), monthAgo = new Date(today), weekAgo = new Date(today), dayAgo = new Date(today)
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)
    sixMonthsAgo.setMonth(monthAgo.getMonth() - 6)
    threeMonthsAgo.setMonth(monthAgo.getMonth() - 3)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    weekAgo.setDate(weekAgo.getDate() - 7)
    dayAgo.setDate(dayAgo.getDate() - 1)
    return {today, dayAgo, weekAgo, monthAgo, threeMonthsAgo, sixMonthsAgo, yearAgo}
}

module.exports = {getTimePeriods}