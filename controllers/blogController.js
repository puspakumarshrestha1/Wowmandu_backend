const BlogModel = require("../models/Blog");

const addBlog = async (req, res) => {
  const blogData = req.body;
  try {
    const newBlog = new BlogModel(blogData);
    const savedBlog = await newBlog.save();
    res.status(200).json({ message: "Blog added successfully!", savedBlog });
  } catch (error) {
    res.status(500).json({ message: "Can not add blog!" });
    console.log("Need authenticated user")
  }
};

const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Blog Updated Successfully!", updatedBlog });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// const deleteBlog = async (req, res) => {
//   const blogID = req.params.id;
//   try {
//     const deletedBlog = await BlogModel.findByIdAndDelete(blogID);
//     if (!deletedBlog) {
//       res.status(404).json({ message: "Blog not found or already deleted!" });
//     }
//     res.status(200).json({ message: "Blog deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting Order from the database" });
//   }
// };

const getBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findOne({ _id: req.params.id });

    if (!blog) {
      return res.status(404).json({ message: "Requested blog not found!" });
    }
    res.status(200).json({ blog: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




//all blogs
const getAllBlogs = async (req, res) => {
  const qCategory = req.query.category;
  let blogs;
  try {
    if (qCategory) {
      blogs = await BlogModel.find({
        categories: {
          $in: [qCategory],
        },
      }).sort({ _id: -1 });
      res.status(200).json({ blogs });
    } else {
      blogs = await BlogModel.find().sort({ _id: -1 });
      res.status(200).json({ allBlogs: blogs });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { addBlog, updateBlog, getBlog, getAllBlogs };
