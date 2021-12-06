const bcrypt = require('bcrypt')
const uuid = require('uuid')

const User = require('../models/user.model')
const mailService = require('./mail.service')
const tokenService = require('./token.service')
const UserDto = require('../dtos/user.dto')
const ApiError = require('../exeptions/api.error')

class AuthService {
    async login(email, password) {
        const user = await User.findOne({email})
        if(!user) {
            throw ApiError.BadRequest(`User with email '${email}' is not found.`);
        }

        const isPasswordsEqual = await bcrypt.compare(password, user.password);
        if(!isPasswordsEqual) {
            throw ApiError.BadRequest(`Incorrect password.`);
        }

        const userDTO = new UserDto(user)
        const tokens = tokenService.generate({...userDTO})
        await tokenService.save(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }
    }

    async logout(refreshToken) {
        const data = await tokenService.remove(refreshToken)

        return data
    }

    async register(email, password) {
        const candidate = await User.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest(`User with email: '${email}' - already exist.`);
        }

        const activationLink = uuid.v4()

        const newUser = await User.create({email, password:hashPassword(password), activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/users/activate/${activationLink}`)

        const userDTO = new UserDto(newUser)
        const tokens = tokenService.generate({...userDTO})
        await tokenService.save(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.find(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findById(userData.id)
        if(!user) {
            throw ApiError.BadRequest(`User is not found.`);
        }

        const userDTO = new UserDto(user)
        const tokens = tokenService.generate({...userDTO})
        await tokenService.save(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }
    }
}

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(7);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

module.exports = new AuthService()