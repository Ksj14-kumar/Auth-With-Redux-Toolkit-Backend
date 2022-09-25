const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
    userAccessId: String,
    name: String,
    email: String,
    password: Object,
    cPassword: Object,
    token: String,
    date: {
        type: String,
        default: Date.now()
    },
    navigator: Object,
    attempts: Array
})
module.exports = mongoose.model("register", Schema);