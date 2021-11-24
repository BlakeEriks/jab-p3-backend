// mongoose object
mongoose = require("./connection")

// portfolio schema
const PortfolioSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    assets: Array,
    balance: Number,
});

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

module.exports = Portfolio