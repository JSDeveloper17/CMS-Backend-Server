const bcrypt = require("bcryptjs")
const  {StatusCodes} = require("http-status-codes")
const Admin = require("../Schema/adminModel.js");
const generateJwtToken = require("../utils/genToken.js");

async function adminRegister(req,res) {
    try{
        const {name, email, password} = req.body;
        
        //* Check existing admin
        const existing = await Admin.findOne({email})
        if(existing){
            return res.status(StatusCodes.BAD_REQUEST).json({
               message: "this email Address already exist",
            });
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const newAdmin = await Admin.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        return res.status(StatusCodes.CREATED).json({
           message: "Admin registered successfully",
           admin: { id: newAdmin._id, email: newAdmin.email },
        })
    }
    catch(error){
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
           reason: "unable to process your request at the moment, please try later",
        });
    }
}

async function loginAdmin(req,res) {

    try{
        const {email,password} = req.body;
        const admin = await Admin.findOne({email})

        if(!admin){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Admin not found. Please check your email."
            })
        }
        const result = await bcrypt.compare(password, admin.password)
        if(!result){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "please check your credential"
            })
        }
        //* Generate JWT token

        const token = generateJwtToken(admin)

        return res.status(StatusCodes.OK).json({
            message: "Login successful",
            token:token,
            admin: { id: admin._id, name: admin.name, email: admin.email },
        })
    }
    catch(error){
        console.log(error)
        return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
            reason: "Unable to process your request at the moment, please try later."
        })
    }
}

module.exports = {adminRegister , loginAdmin}