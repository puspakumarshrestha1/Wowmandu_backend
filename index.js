const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();

const connectDB = require("./configs/connectdb");
const blogRoute = require("./routes/blogRoute");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.use("/api/blog", blogRoute);

connectDB(DATABASE_URL);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`Server started listening to http://localhost:${PORT}`);
});
