const Router = require('express').Router

const authController = require('../app/controllers/auth.controller')
const authValidator = require('../app/validators/auth.validator')

const router = new Router()

router.post('/login', authValidator(), authController.login)

router.post('/logout', authController.logout)

router.post('/register', authValidator(), authController.register)

router.get('/refresh', authController.refresh)

module.exports = router