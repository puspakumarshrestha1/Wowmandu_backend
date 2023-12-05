const express = require("express");
const router = express.Router();
const {
  addBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogs,
} = require("../controllers/blogController");

// protected route TODO
// router.post("/add-blog",addBlog);
// router.put("/update-blog/:id",updateBlog);
// router.delete("/:id",deleteBlog);

//routes
router.post("/add-blog", addBlog);
router.put("/update-blog/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.get("/find/:id", getBlog);
router.get("/", getAllBlogs);

module.exports = router;
