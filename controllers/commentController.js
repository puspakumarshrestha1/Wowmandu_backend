const CommentModel = require("../models/Comment");

const addComment = async (req, res) => {
  const newCommentData = req.body;
  try {
    const newComment = new CommentModel(newCommentData);
    const savedComment = await newComment.save();
    res.status(200).json({ message: "Comment added successfully!", savedComment });
  } catch (error) {
    res.status(500).json({ message: "Can not add Comment!" });
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
      res.status(404).json({ message: "Comment not found or already deleted!" });
    }
    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Order from the database" });
  }
};

const getComment = async (req, res) => {
  try {
    const Comment = await CommentModel.findOne({ CommentID: req.params.CommentID });
    if (!Comment) {
      res.status(404).json({ message: "Requested Comment not found!" });
    }
    res.status(200).json({ Comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// const getAllComments = async (req, res) => {
//   try {
//     const allComments = await CommentModel.find();
//     if (!allComments || allComments.length === 0) {
//       res.status(404).json({ message: "Comments not found!" });
//     } else {
//       res.status(200).json({ allComments });
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

module.exports = { addComment, updateComment, deleteComment, getComment};
