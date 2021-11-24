// mongoose object
mongoose = require("./connection")

// user schema
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    img_url: String,
});

const User = mongoose.model("User", UserSchema);

// export
module.exports = User