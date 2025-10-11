
const express = require("express")
const { createProject, getProject, getProjectById, updateProject, deleteProject } = require("../controllers/projectController.js")
const upload = require("../middleware/multer.js")
const authentication = require("../middleware/authenticateToken.js")
const projectRouter = express.Router()

//*Public Route
projectRouter.get("/api/projects",authentication, getProject)
projectRouter.get("/api/projects/:id", getProjectById)

//*Protected Route
projectRouter.post("/api/projects",authentication ,upload.single("image"), createProject)
projectRouter.put("/api/projects/:id",authentication ,upload.single("image"), updateProject)
projectRouter.delete("/api/projects/:id",authentication , deleteProject)

module.exports =projectRouter;