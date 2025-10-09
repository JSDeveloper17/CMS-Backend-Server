const {Schema, model}= require("mongoose")

const adminSchema = new Schema({
    name:{
        type:String,
        required:[true, "User Name is Required"],
        trim:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    }
}, {timestamps:true, versionKey:false })

const Admin = model("Admin", adminSchema)

module.exports = Admin;