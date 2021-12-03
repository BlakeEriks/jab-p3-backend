const { initDB, updateDB } = require("./jobs")
const tokenCache = require('./util/tokenCache')

const jobService = {

    init: async () => {
        console.log('begin initialize')
        await initDB()
        console.log('finished init')
        process.exit()
    },

    update: async () => {
        console.log('begin update database')
        await updateDB()
        tokenCache.invalidateCache()
        console.log('finished update')
        process.exit()
    }

}

module.exports = jobService