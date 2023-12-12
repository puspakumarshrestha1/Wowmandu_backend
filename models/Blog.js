const mongoose = require("mongoose");
const CommentModel = require("../models/Comment")

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: Array },
    blogContent: { type: String, required: true },
    author: { type: String, required: true },
    blog_comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "CommentModel" },
    ],
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("Blog", blogSchema);

module.exports = BlogModel;
