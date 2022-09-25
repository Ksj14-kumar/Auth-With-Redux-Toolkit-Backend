const LocalStrategy = require("passport-local").Strategy;
const User = require("./db/Register")
const bcrypt = require("bcrypt")
module.exports = async (passport) => {
    console.log("calling...")
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, function (username,password,done) {
        console.log({ username, password })
        User.findOne({ email: username }, async function (err, user) {
            console.log({ user })
            if (err) {
                console.log({ err: err })
                return done(err);
            }
            if (!user) { return done(null, false, { message: "user not found" }); }
            // if (!user.verifyPassword(password)) { return done(null, false); }
            if (user) {
                console.log({ user })
                const { email, cPassword } = user
                const isValid = await bcrypt.compare(password, cPassword)
                if (!isValid) {
                    return done(null, false, { message: "invalid credentials" })
                }
                return done(null, user);
            }
        });
    }))
    passport.serializeUser(function (user, cb) {
        // console.log(cb(null, user.id))
        console.log("serialize", user)
        return cb(null, user.id);
        // done(null, user)
    });
    passport.deserializeUser(function (id, cb) {
        console.log("deserilize", id)
        User.findById(id, function (err, user) {
            console.log("deserializer", { user })
            if (err) {
                return cb(null, false, { error: err });
            }
            return cb(null, user)
        });
        // done(null, user)
    });
    // ===================== MUltiple Strategy===========
    // passport.use("strategy one")
    // passport.use("strategy 2nd ")
    // passport.use("strategy 3rd")
    // passport.use("strategy 4th")
    // passport.use("strategy 5th")
    // //passport seriesalize and deserilize user
    // passport.serializeUser()
    // passport.deserializeUser()
}