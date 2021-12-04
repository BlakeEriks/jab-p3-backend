// mongoose object
mongoose = require("./connection")

const HistoryDataSchema = new mongoose.Schema({
    timestamp: {type: Date, required: true},
    value: {type: Number, required: true}
}, {_id: false})

const HistorySchema = new mongoose.Schema({
    period: {type: String, required: true},
    interval: {type: Number, required: true},
    data: [HistoryDataSchema]
}, {_id: false})

const TokenSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    symbol: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    percentChange: {type: Number, required: true},
    history: [HistorySchema]
});

const Token = mongoose.model("Token", TokenSchema);

// export
module.exports = Token