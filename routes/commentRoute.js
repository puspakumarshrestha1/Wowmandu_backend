const express = require("express");
const router = express.Router();

const {
  addComment,
  updateComment,
  deleteComment,
  getComment,
} = require("../controllers/commentController");

// protected route

router.get("/", getComment);
router.post("/", addComment);
router.put("/update-cmt/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;
