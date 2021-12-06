const userService = require('../services/user.service')

class UserController {
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)

            return res.redirect(process.env.CLIENT_URL)
        }
        catch (e) {
            next(e)
        }
    }

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll()

            return res.json(users)
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()