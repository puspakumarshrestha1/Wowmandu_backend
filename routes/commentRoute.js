const express = require("express");
const router = express.Router();

const {
  addComment,
  updateComment,
  deleteComment,
  getComment,
} = require("../controllers/commentController");

router.get("/:blog_id/comments", getComment);
router.post("/:blog_id/comments/create", addComment);
router.put("/:blog_id/update-cmt/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
