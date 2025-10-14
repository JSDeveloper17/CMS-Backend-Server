const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js"); // adjust path if needed

// Configure Cloudinary storage for Multer
// Create Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cms_projects", // Folder name on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], // optional resize
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;