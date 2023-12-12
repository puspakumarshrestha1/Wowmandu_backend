const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    blog_id: { type: mongoose.Schema.Types.ObjectId, ref: "BlogModel" },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
