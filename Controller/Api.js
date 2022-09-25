const paramterChecking = require("../Parameter")
const RegisterPost = require("../db/Register")
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = process.env.SECRET
const { v4: uuid } = require("uuid")
const axios = require("axios")
const passport = require("passport")
module.exports.get = async (req, res) => {
    try {
        res.setHeader("Content-Type", ["application/json", "plain/text"])
        res.json({ message: "success", data: "hello" })
    } catch (err) {
        throw new Error(err)
    }
}
module.exports.simplePost = async (req, res) => {
    try {
        console.log(req.body)
        res.setHeader("Content-Type", ["application/json", "plain/text"])
        res.json({ message: "success", data: "hello" })
    } catch (err) {
        throw new Error(err)
    }
}
module.exports.register = async (req, res) => {
    try {
        let { name, email, password, cPassword, navigate } = req.body.data;
        name = name.trim()
        email = email.trim()
        password = password.trim()
        cPassword = cPassword.trim()
        console.log(req.body)
        res.setHeader("Content-Type", ["application/json"])
        if (!name || !email || !password || !cPassword) {
            // throw new Error("something is missing")
            return res.status(422).jsonp({ message: "something is missing" })
        }
        else if (!paramterChecking.parameter({ type: "email", parameter: email })) {
            // throw new Error("invalid Email")
            return res.status(422).jsonp({ message: "invalid email" })
        }
        else if (!paramterChecking.parameter({ type: "password", parameter: password })) {
            // throw new Error("invalid Password formate")
            return res.status(422).jsonp({ message: "invalid password" })
        }
        else if (!paramterChecking.parameter({ type: "name", parameter: name })) {
            // throw new Error("invalid name")
            return res.status(422).jsonp({ message: "invalid name" })
        }
        else if (password !== cPassword) {
            return res.status(422).jsonp({ message: "password not match" })
            throw new Error("password not match")
        }
        const getUser = await RegisterPost.findOne({ email })
        console.log({ getUser })
        if (getUser) {
            return res.status(409).jsonp({ message: "already exists" })
        }
        const result = await new RegisterPost({
            name,
            email: email.toLowerCase(),
            password: await bcrypt.hash(password, 16),
            cPassword: await bcrypt.hash(cPassword, 16),
            date: Date.now(),
            token: await JWT.sign(email, secret),
            navigator: navigate,
            userAccessId: uuid()
        })
        await result.save()
        return res.status(200).jsonp({ message: "Success" })
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
module.exports.login = async (req, res) => {
    try {
        console.log(req.body)
        let { email, password, navigate } = req.body.data;
        email = email.trim().toLowerCase()
        password = password.trim()
        const pass = password
        if (!email || !password) {
            return res.status(422).jsonp({ message: "something is missing" })
        }
        const getUser = await RegisterPost.findOne({ email });
        if (getUser) {
            //matching the password
            console.log([getUser])
            const { email, cPassword, name, userAccessId } = getUser;
            const checkPassword = await bcrypt.compare(pass, cPassword)
            console.log({ checkPassword })
            if (!checkPassword) {
                return res.status(400).jsonp({ message: "something wrong" })
            }
            const token = await JWT.sign(email, secret)
            await RegisterPost.findOneAndUpdate({ email }, { $push: { attempts: { token, navigate } } })
            return res.cookie("access", name).status(200).jsonp({ access_token: token, name: name, userId: userAccessId })
        }
        return res.status(404).jsonp({ message: "user does not exits" })
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
module.exports.news = async (req, res) => {
    try {
        const res1 = await axios.get("https://hutils.loxal.net/whois");
        console.log(res1.data)
        // console.log(res1)
        const result = await axios.get(`https://newsapi.org/v2/top-headlines?country=${res1.data.countryIso.toLowerCase()}&apiKey=${process.env.NEWS_API}`)
        console.log(result.data)
        return res.status(200).jsonp(result.data)
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
module.exports.LocalStrategyAuth = async (req, res, next) => {
    try {
        passport.authenticate("local", async (err, user, info) => {
            console.log({ err, user, info })
            if (err) {
                res.status(500).jsonp({ message: "Oops, Something error occured" })
                return
            }
            else if (!user) {
                res.status(404).jsonp({ message: "User not found" })
                return
            }
            else {
                console.log("user data", { user })
                const { navigate } = req.body;
                const token = await JWT.sign(user.email, secret)
                await RegisterPost.findOneAndUpdate({ email: user.email }, { $push: { attempts: { token, navigate } } })
                return res.cookie("access", user.name).status(200).jsonp({ access_token: token, name: user.name, userId: user.userAccessId })
            }
        })(req, res, next)
    } catch (err) {
        console.log({ err })
        throw new Error(err)
    }
}
module.exports.logOut = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.clearCookie("access_token")
            res.status(200).json({ message: process.env.CLIENT_URL })
            return
        });
    } catch (err) {
        console.log("err", err)
        throw new Error(err)
    }
}