const CommentModel = require("../models/Comment");
const BlogModel = require("../models/Blog");
const mongoose = require("mongoose");

const addComment = async (req, res) => {
  try {
    let newCommentData = req.body;
    const blog_id = req.params.blog_id;

    if (!newCommentData) {
      return res
        .status(400)
        .json({ message: "Comment field can not be empty!" });
    }

    if (!mongoose.Types.ObjectId.isValid(blog_id)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const confirmBlogId = await BlogModel.findById(blog_id);

    if (!confirmBlogId) {
      return res
        .status(404)
        .json({ message: "Blog not found to add comment." });
    }

    let newComment = new CommentModel({
      ...newCommentData,
      blog_id: blog_id,
    });

    const savedComment = await newComment.save();

    await BlogModel.updateOne(
      { _id: blog_id },
      {
        $push: { blog_comments: newComment._id },
      }
    );

    return res.status(200).json({
      message: "Comment added successfully!",
      savedComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot add comment." });
  }
};

const updateComment = async (req, res) => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Comment Updated Successfully!", updatedComment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteComment = async (req, res) => {
  const CommentID = req.params.id;
  try {
    const deletedComment = await CommentModel.findByIdAndDelete(CommentID);
    if (!deletedComment) {
      res
        .status(404)
        .json({ message: "Comment not found or already deleted!" });
    }
    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Order from the database" });
  }
};

// const getComment = async (req, res) => {
//   try {
//     const blog_id = req.params.blog_id;

//     if (!mongoose.Types.ObjectId.isValid(blog_id)) {
//       return res.status(400).json({ message: "Invalid blog ID." });
//     }

//     const confirmBlogId = await BlogModel.findById(blog_id);

//     if (!confirmBlogId) {
//       return res
//         .status(404)
//         .json({ message: "Blog not found to a comment update." });
//     }

//     let query = [
//       {
//         $lookup: {
//           from: "blog",
//           localField: "title",
//           foreignField: "_id",
//           as: "blog",
//         },
//       },
//       { $unwind: "$blog" },
//       {
//         $match: {
//           blog_id: mongoose.Types.ObjectId(blog_id),
//         },
//       },
//       {
//         $sort:{
//           createdAt:-1
//         }
//       }
//     ];




// const getComment = async (req, res) => {
//   try {
//     const blog_id = req.params.blog_id;

//     if (!mongoose.Types.ObjectId.isValid(blog_id)) {
//       return res.status(400).json({ message: "Invalid blog ID." });
//     }

//     const confirmBlogId = await BlogModel.findById(blog_id);

//     if (!confirmBlogId) {
//       return res
//         .status(404)
//         .json({ message: "Blog not found to a comment update." });
//     }

//     let query = [
//       {
//         $lookup: {
//           from: "blogs",  // Assuming the "comments" collection name
//           localField: "blog_id",  // Assuming "title" is the field in "blog" to match
//           foreignField: "_id",  // Assuming "blog_id" is the field in "comments" to match
//           as: "blog",
//         },
//       },
//       { $unwind: "$blog" },
//       {
//         $match: {
//           "blog_id": mongoose.Types.ObjectId(blog_id),
//         },
//       },
//       {
//         $sort: {
//           "createdAt": -1,
//         },
//       },
//     ];

//     let comments = await CommentModel.aggregate(query);

//     return res.status(200).json({
//       message: "Comments fetched successfully!",
//       data: {
//         comments: comments,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error!" });
//   }
// };





//     let comments = await CommentModel.aggregate(query);
//     return res.status(200).json({
//       message: "Comments fetched succesfully!",
//       data: {
//         comments: comments,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error!" });
//   }
// };

const getComment = async (req, res) => {
  try {
    const Comment = await CommentModel.find()
    // const Comment = await CommentModel.findOne({
    //   CommentID: req.params.CommentID,
    // });
    if (!Comment) {
      res.status(404).json({ message: "Requested Comment not found!" });
    }
    res.status(200).json({ Comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { addComment, updateComment, deleteComment, getComment };
