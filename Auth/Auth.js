const JWT = require("jsonwebtoken");
const secret = process.env.SECRET
const User = require("../db/Register")
module.exports.auth = async (req, res, next) => {
    try {
        console.log(req.headers)
        const token = req.headers.authorization.split("Bearer ")[1]
        console.log({ token })
        const verifyToken = await JWT.verify(token, secret)
        console.log({ verifyToken })
        const getUser = await User.findOne({ email: verifyToken })
        console.log({ getUser })
        if (!getUser) {
            return res.status(404).jsonp({ message: "user not exits" })
        }
        req.email = verifyToken
        req.user = getUser
        next()
    } catch (err) {
        console.log({ err })
        throw new Error("Something error occured")
    }
}