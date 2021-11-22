// mongoose object
mongoose = require("./connection")

// portfolio schema
const PortfolioSchema = new mongoose.Schema({
    id: String,
    user_id: String,
    assets: Object,
    balance: Number,
    history: Array,
    value: Number,
    img_url: String,
});

const Portfolio = mongoose.model("Portfolio", PortfolioSchema);

mondule.exports = Portfolio