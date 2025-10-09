const {StatusCodes} = require("http-status-codes")
const cloudinary = require("../config/cloudinary.js")
const fs = require("fs")
const Project = require("../Schema/ProjectModel.js")



async function createProject(req,res) {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
    try{
        const { title, description, technologies, githubLink, liveLink, featured } = req.body;
    let imageUrl = "";

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio_projects",
      });

      // Get secure Cloudinary URL
      imageUrl = result.secure_url;

      // Delete local file
      fs.unlinkSync(req.file.path);
    }

    // Save project to MongoDB
    const newProject = await Project.create({
      title,
      description,
      technologies: technologies ? technologies.split(",") : [],
      githubLink,
      liveLink,
      featured,
      image: imageUrl, // 👈 Cloudinary image link saved here
    });
     res.status(StatusCodes.CREATED).json(newProject)
    }
    catch(error){
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({
            message:"Invalid Data", error:error.message
        })
    }
}

async function getProject(req,res) {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
     try{
         const allProject = await Project.find().sort({createdAt:-1});
         
         res.status(StatusCodes.OK).json(allProject)
        }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:"Server Error", error:error.message
        })
    }
}

const getProjectById = async (req, res) => {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//   Update a project
// @route  PUT /api/projects/:id
const updateProject = async (req, res) => {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

//   Delete a project
// @route  DELETE /api/projects/:id
const deleteProject = async (req, res) => {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports={getProject, createProject, deleteProject, updateProject, getProjectById}