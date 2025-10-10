const {StatusCodes} = require("http-status-codes")
const cloudinary = require("../config/cloudinary.js")
const fs = require("fs")
const Project = require("../Schema/ProjectModel.js")



async function createProject(req,res) {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
    try{
        const { title, description, githubLink, liveLink } = req.body;

    // Cloudinary upload handled by multer middleware earlier
        const image = req.file ? req.file.path : null;

        const newProject = await Project.create({
            title,
            description,
            githubLink,
            liveLink,
            image,
            user: req.user._id, // ✅ link project to logged-in user
       });
        res.status(StatusCodes.CREATED).json(
          {message: "Project created successfully",newProject})
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
         const allProject = await Project.find({ user: req.user._id });
         
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
    const updated = await Project.findById(req.params.id);

    if (!updated) return res.status(404).json({ message: "Project not found" });

    if (updated.user.toString() !== req.user._id.toString())
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });

    // Update image if new one is uploaded
    const image = req.file ? req.file.path : updated.image;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(updatedProject);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Invalid data", error: error.message });
  }
};

//   Delete a project
// @route  DELETE /api/projects/:id
const deleteProject = async (req, res) => {
    console.log("Req Method : ", req.method)
    console.log("Req Url : ", req.url)
  try {
    const deleted = await Project.findById(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Project not found" });
    if (deleted.user.toString() !== req.user._id.toString())
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });

    await deleted.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
module.exports={getProject, createProject, deleteProject, updateProject, getProjectById}