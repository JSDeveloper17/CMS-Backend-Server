const express = require("express")
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController.js")
const authentication = require("../middleware/authenticateToken.js")
const blogRouter = express.Router()

//*bublic route
blogRouter.get("/api/blogs", getAllBlogs)
blogRouter.get("/api/blogs/:id", getBlogById)

//!protected route
blogRouter.post("/api/blogs",authentication, createBlog)
blogRouter.put("/api/blogs/:id",authentication, updateBlog)
blogRouter.delete("/api/blogs/:id",authentication, deleteBlog)

module.exports = blogRouter;