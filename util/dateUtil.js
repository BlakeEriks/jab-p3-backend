const getTimePeriods = () => {
    const today = new Date()
    const yearAgo = new Date(today), monthAgo = new Date(today), weekAgo = new Date(today), dayAgo = new Date(today)
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    weekAgo.setDate(weekAgo.getDate() - 7)
    dayAgo.setDate(dayAgo.getDate() - 1)
    return {today, dayAgo, weekAgo, monthAgo, yearAgo}
}

module.exports = {getTimePeriods}