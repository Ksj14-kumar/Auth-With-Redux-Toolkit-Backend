const router = require("express").Router()
const { register, login, simplePost, get, news, LocalStrategyAuth, logOut } = require("./Controller/Api")
const Auth = require("./Auth/Auth")
function Middleware(req, res, next) {
    req.body = req.body.data
    console.log(req.body)
    next()
}
router.get("/", get)
router.post("/", simplePost)
router.post("/register", register)
router.post("/login", Middleware, LocalStrategyAuth)
router.get("/news", Auth.auth, news)
router.get("/logout", Auth.auth, logOut)
module.exports = router;
