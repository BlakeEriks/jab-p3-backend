// mongoose object
mongoose = require("./connection")

// user schema
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    portfolio: [
        {
            timestamp: {type: Date, required: true}, 
            assets: {type: [{
                symbol: {type: String, required: true},
                quantity: {type: Number, required: true}
            }], required: true}, 
            balance: {type: Number, require: true}
        }
    ],
    img_url: String,
});

const User = mongoose.model("User", UserSchema);

// export
module.exports = User