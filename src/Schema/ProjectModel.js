const {Schema, model} = require("mongoose")

const projectSchema = new Schema({
    title:{
        type:String,
        required:[true, "Project Title is required"],
        trim:true
    },
    description:{
        type:String,
        required:true,
    },
    technologies:{
        type:[String],
        required:true,
    },
    image:{
        type:String,
    },
    githubLink:{
        type:String
    },
    liveLink: {
      type: String,
    },
    user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, {timestamps:true, versionKey:false})

const Project = model("Project", projectSchema)

module.exports = Project;