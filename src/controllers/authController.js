const bcrypt = require("bcryptjs")
const  {StatusCodes} = require("http-status-codes")
const generateJwtToken = require("../utils/genToken.js");
const User = require("../Schema/adminModel.js");

async function userRegister(req,res) {
    try{
        const {name, email, password} = req.body;
        
        //* Check existing admin
        const existing = await User.findOne({email})
        if(existing){
            return res.status(StatusCodes.BAD_REQUEST).json({
               message: "this email Address already exist",
            });
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        return res.status(StatusCodes.CREATED).json({
           message: "User registered successfully",
           user: { id: newUser._id, email: newUser.email },
        })
    }
    catch(error){
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
           reason: "unable to process your request at the moment, please try later",
        });
    }
}

async function loginUser(req,res) {

    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})

        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User not found. Please check your email."
            })
        }
        const result = await bcrypt.compare(password, user.password)
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "please check your credential"
            })
        }
        //* Generate JWT token

        const token = generateJwtToken(user)

        return res.status(StatusCodes.OK).json({
            message: "Login successful",
            token:token,
            user: { id: user._id, name: user.name, email: user.email },
        })
    }
    catch(error){
        console.log(error)
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
            reason: "Unable to process your request at the moment, please try later."
        })
    }
}

module.exports = {userRegister , loginUser}