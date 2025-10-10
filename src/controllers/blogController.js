const {StatusCodes} = require("http-status-codes")
const Blog = require("../Schema/BlogModel.js");

async function createBlog(req,res) {
    console.log("Req Method : ", req.method);
    console.log("Req URL : ", req.url);
    try{
        const { title, content } = req.body;
        const newBlog = await Blog.create({
      title,
      content,
      user: req.user._id  // ✅ link to logged-in user
    });
        res.status(StatusCodes.CREATED).json({message: "Blog created successfully",newBlog})

    }
    catch(error){
        console.log(error)
        return res.status(StatusCodes.BAD_GATEWAY).json(
            { message: "Failed to create blog", error: error.message})
    }
}
//  Get all blogs
// @route  GET /api/blogs
const getAllBlogs = async (req, res) => {
    console.log("Req Method : ", req.method);
    console.log("Req URL : ", req.url);
  try {
    const blogs = await Blog.find({ user: req.user._id })
    res.status(StatusCodes.OK).json(blogs);
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(
        { message: "Failed to fetch blogs", error: error.message });
  }
};

// Get single blog by ID
// @route  GET /api/blogs/:id
const getBlogById = async (req, res) => {
    console.log("Req Method : ", req.method);
    console.log("Req URL : ", req.url)
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(StatusCodes.NOT_FOUND).json({ message: "Blog not found" });

    res.status(StatusCodes.OK).json(blog);
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({ message: "Failed to fetch blog", error: error.message });
  }
};

const updateBlog = async (req, res) => {
    console.log("Req Method : ", req.method);
    console.log("Req URL : ", req.url);
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(StatusCodes.NOT_FOUND).json({ message: "Blog not found" });
    if (blog.user.toString() !== req.user._id.toString())
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Not authorized" });

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(StatusCodes.OK).json(updated);
  } catch (error) {
    res.status(StatusCodes.GATEWAY_TIMEOUT).json({ message: "Failed to update blog", error: error.message });
  }
};

//   Delete a blog
// @route  DELETE /api/blogs/:id
const deleteBlog = async (req, res) => {
    console.log("Req Method : ", req.method);
    console.log("Req URL : ", req.url);
    
  try{
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await blog.deleteOne();
    res.status(StatusCodes.OK).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.GATEWAY_TIMEOUT).json({ message: "Failed to delete blog", error: error.message });
  }
};
module.exports = {createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog}