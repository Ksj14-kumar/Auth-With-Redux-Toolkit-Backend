const express = require("express")
const app = express();
require("dotenv").config();
const fs = require('fs')
const utl = require("util")
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./Router");
const mongoose = require("mongoose")
const session = require("express-session");
const passport = require("passport")
const CookieParser = require("cookie-parser")
const PORT = process.env.PORT || 5000
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authapp"
mongoose.connect(MONGO, (err) => {
    if (err) {
        console.log("not connect")
        throw new Error(err)
    }
    console.log("db is connected...")
})
app.use(bodyParser.json({ limit: "6mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb" }))
app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}))
app.use(session({
    name: "session",
    secret: "session",
    saveUninitialized: true,
    resave: true,
    cookie: {
        secure: "auto",
    }
}))
app.use(CookieParser())
app.use(passport.initialize())
app.use(passport.session())
require("./LocalStrategy")(passport)
app.use("/api/v1", router);
console.log = function (d) {
    fs.createWriteStream(__dirname + "/log.log", { flags: "a" }).write(utl.format(d) + "\n")
    process.stdout.write(utl.format(d) + "\n")
}
app.listen(PORT, (err) => {
    if (err) throw new Error(err)
    console.log("server is start at port", PORT)
})