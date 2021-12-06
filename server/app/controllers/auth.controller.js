const {validationResult} = require('express-validator')

const authService = require('../services/auth.service')
const ApiError = require('../exeptions/api.error')

class AuthController {
    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                throw ApiError.BadRequest('Validation error.', errors.array())
            }

            const {email, password} = req.body
            const userData = await authService.login(email, password)

            setRefreshCookie(res, userData)

            res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await authService.logout(refreshToken)

            res.clearCookie('refreshToken')
            res.json(token)
        }
        catch (e) {
            next(e)
        }
    }

    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                throw ApiError.BadRequest('Validation error.', errors.array())
            }

            const {email, password} = req.body
            const userData = await authService.register(email, password)

            setRefreshCookie(res, userData)

            res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await authService.refresh(refreshToken)

            setRefreshCookie(res, userData)

            res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }
}

function setRefreshCookie(res, userData) {
    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
}

module.exports = new AuthController()