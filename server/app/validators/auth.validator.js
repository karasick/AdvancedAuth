const {check} = require('express-validator')

const authValidator = () => {
    return [
        check('email', "Email address must be valid.").isEmail(),

        check('password', "Password must be at least 4-20 characters' long.").isLength({min:4, max:20})
    ]
}

module.exports = authValidator;