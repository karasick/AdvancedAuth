const ApiError = require('../exeptions/api.error')

module.exports = function (err, req, res, next) {
    // console.log("err1")
    // console.log(err)
    // console.log("err2")
    if(err instanceof ApiError)
        return res.status(err.status).json({message: err.message, errors: err.errors})

    return res.status(500).json({message: "Unexpected error."})
}