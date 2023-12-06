const AuthModel = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { firstName, lastName, password, confirmPassword, isAdmin, email } =
    req.body;
  try {
    if (firstName && lastName && password && confirmPassword && email) {
      const existingUser = await AuthModel.findOne({ email: email });
      if (existingUser) {
        res.status(409).json({
          message: "A user with the provided phoneNo address already exists.",
        });
      } else {
        if (password === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = bcrypt.hash(password, salt);
          const newUser = new AuthModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            isAdmin: isAdmin,
          });
          await newUser.save();
          const savedUser = await AuthModel.findOne({ email: email });
          const token = jwt.sign(
            { userID: savedUser._id },
            process.env.SECRET_JWT_KEY,
            { expiresIn: "5d" }
          );
          res
            .status(201)
            .json({ message: "Registration success!", token: token });
        } else {
          res.status(422).json({
            message: "The provided password and confirm password do not match.",
          });
        }
      }
    } else {
      res.status(400).json({ message: "All fields are required!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const existingUser = await AuthModel.findOne({ email: email });
      if (existingUser === null) {
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (existingUser.email === email && isMatch) {
          const token = await jwt.sign(
            { userID: existingUser._id },
            process.env.SECRET_JWT_KEY,
            { expiresIn: "5d" }
          );
          res
            .status(200)
            .json({ message: "Logged in successfully!", token: token });
        }
      } else {
        res.status(404).json({ message: "No user found with this email!" });
      }
    } else {
      res.status(400).json({ message: "All fields are required!" });
    }
  } catch (error) {
    res.send({ status: "failed", message: "Unable to Login" });
  }
};

// change password by logged in user

const changePassword = async (req,res) => {
  
}
