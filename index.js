const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer")
const path = require("path")
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use("/images",express.static(path.join(__dirname,"/images")));

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const connectDB = require("./configs/connectdb");
const blogRoute = require("./routes/blogRoute");
const commentRoute = require("./routes/commentRoute");
const authRoute = require("./routes/authRoute");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/blog/add-image", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});


app.use("/api/blog", blogRoute);
app.use("/api/comment", commentRoute);
app.use("/api/auth", authRoute);

connectDB(DATABASE_URL);

app.listen(PORT, () => {
  console.log(`Server started listening to http://localhost:${PORT}`);
});
