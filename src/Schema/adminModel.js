const {Schema, model}= require("mongoose")

const userSchema = new Schema({
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

const User = model("User", userSchema)

module.exports = User;