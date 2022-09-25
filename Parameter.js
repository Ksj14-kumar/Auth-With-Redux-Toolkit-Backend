module.exports.parameter = (value) => {
    let pattern;
    switch (value.type) {
        case "name":
            pattern = /^[a-zA-Z ]{3,30}$/
            return pattern.test(value.parameter)
        case "email":
            pattern = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i
            return pattern.test(value.parameter)
        case "password":
            pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            return pattern.test(value.parameter)
        default:
            throw new Error("something error occured")
    }
}