const Router = require('express').Router
const userController = require('../app/controllers/user.controller')
const authMiddleware = require('../app/middlewares/auth.middleware')

const router = new Router()

router.get('/users', authMiddleware, userController.getAll)

router.get('/users/activate/:link', userController.activate)

module.exports = router