// mongoose object
mongoose = require("./connection")

// user schema
const UserSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    created: Date,
});

const User = mongoose.model("User", UserSchema);


// export
module.exports = User