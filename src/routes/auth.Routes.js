const express = require("express")
const { adminRegister, loginAdmin } = require("../controllers/authController.js")
const authRouter = express.Router()

authRouter.post("/register", adminRegister)
authRouter.post("/login", loginAdmin)

module.exports = authRouter