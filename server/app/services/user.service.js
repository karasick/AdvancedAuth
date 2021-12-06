const User = require('../models/user.model')
const ApiError = require("../exeptions/api.error");

class UserService {
    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if(!user) {
            throw ApiError.BadRequest('Incorrect activation link.')
        }

        user.isActivated = true;
        await user.save();
    }

    async getAll() {
        const users = await User.find()

        return users
    }
}

module.exports = new UserService()