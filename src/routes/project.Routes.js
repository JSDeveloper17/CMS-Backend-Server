
const express = require("express")
const { createProject, getProject, getProjectById, updateProject, deleteProject } = require("../controllers/projectController.js")
const projectRouter = express.Router()

//*Public Route
projectRouter.get("/api/projects", getProject)
projectRouter.get("/api/projects/:id", getProjectById)

//*Protected Route
projectRouter.post("/api/project", createProject)
projectRouter.put("/api/projects/:id", updateProject)
projectRouter.delete("/api/projects/:id", deleteProject)

module.exports =projectRouter;