const express = require("express");
const router = express.Router();
const {
  addBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogs,
} = require("../controllers/blogController");
// const verifyAdmin = require("../middlewares/verifyAdmin")

// protected route 
// router.post("/add-blog",verifyAdmin);
// router.put("/update-blog/:id",verifyAdmin);
// router.delete("/:id",verifyAdmin);

//routes
// router.post("/add-blog", upload.single("file"), addBlog);
router.post("/add-blog", addBlog);
router.put("/update-blog/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.get("/find/:id", getBlog);
router.get("/", getAllBlogs);


module.exports = router;
