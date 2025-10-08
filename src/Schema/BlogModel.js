const {Schema, model}= require("mongoose")

const blogSchema = new Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    }
}, {timestamps:true, versionKey:false})

const Blog = model("Blog", blogSchema)

module.exports = Blog