require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const authRouter = require('./routers/auth.router')
const userRouter = require('./routers/user.router')
const errorMiddleware = require('./app/middlewares/error.middleware')

const PORT = process.env.PORT | 5000

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use('/auth', authRouter)
app.use('/api', userRouter)

app.use(errorMiddleware)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
    }
    catch (e) {
        console.log(e)
    }
}

start()