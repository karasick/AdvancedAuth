const jwt = require('jsonwebtoken')
const Token = require('../models/token.model')

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

class TokenService {
    generate(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: "20s"})
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: "30d"})

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET)

            return userData
        }
        catch (e) {
            return null;
        }
    }


    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET)

            return userData
        }
        catch (e) {
            return null;
        }
    }
    async save(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const newToken = await Token.create({user: userId, refreshToken})

        return newToken
    }

    async remove(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken})

        return tokenData
    }

    async find(refreshToken) {
        const tokenData = await Token.findOne({refreshToken})

        return tokenData
    }
}

module.exports = new TokenService()