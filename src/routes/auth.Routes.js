const express = require("express")
const { loginUser, userRegister } = require("../controllers/authController.js")
const authRouter = express.Router()

authRouter.post("/register", userRegister)
authRouter.post("/login", loginUser)

module.exports = authRouter