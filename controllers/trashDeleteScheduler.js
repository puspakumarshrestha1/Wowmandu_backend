const express = require("express");
const app = express();
const fs = require("fs");
const cron = require("node-cron");
const path = require("path")
const BlogModel = require("../models/Blog")

const deleteBlog = () => {
  app.delete("/delete/:filename", (req, res) => {
    const { filename } = req.params;
    if (!filename) {
      return;
    } else {
      const sourcePath = path.join(__dirname, "images", filename);
      const trashPath = path.join(__dirname, "trash", filename);

      fs.rename(sourcePath, trashPath, (error) => {
        if (error) {
          console.error("Error moving file to trash:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json({ message: "File removed successfully!" });
      });
    }
  });

  // Delete blog endpoint
  app.delete("/blog/delete/:id", async (req, res) => {
    // const blogID = req.params.id;
    const { id } = req.params;
    try {
      const deletedBlog = await BlogModel.findByIdAndDelete(id);
      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found or already deleted!" });
      }
      res.status(200).json({ message: "Blog deleted successfully!" });
    } catch (error) {
      console.error("Error deleting blog from the database:", error);
      res.status(500).json({ message: "Error deleting blog from the database" });
      console.log(error)
    }
  });

  // cron.schedule("* * * * *", () => {
    cron.schedule("0 0 * * 0", () => {
    const trashPath = path.join(__dirname, "trash");
    // Delete files in the trash folder
    fs.readdir(trashPath, (err, files) => {
      if (err) {
        console.error("Error reading trash folder:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(trashPath, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file in trash folder:", err);
          } else {
            console.log(`File ${file} deleted successfully.`);
          }
        });
      });
    });
  });
}

module.exports = { deleteBlog };