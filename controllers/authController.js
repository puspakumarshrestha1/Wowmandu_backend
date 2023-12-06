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
const changePassword = async (req, res) => {
  const { newPassword, confirmNewPassword, email, currentPassword } = req.body;
  try {
    const user = await AuthModel.findOne({ email: email });
    const oldPasswordDb = user.password;
    if (newPassword && confirmNewPassword && oldPasswordDb && currentPassword) {
      if (oldPasswordDb === previousPassword) {
        if (newPassword === confirmNewPassword) {
          const salt = bcrypt.genSalt(10);
          const hashedPassword = bcrypt.hash(newPassword, salt);
          //save new password
          await AuthModel.findByIdAndUpdate(req.user._id, {
            $set: { password: hashedPassword },
          });
          res.status(200).json({ message: "Password changed successfully!" });
        } else {
          res
            .status(400)
            .json({ message: "Password and Confirm Password does not match!" });
        }
      } else {
        res.status(400).json({ message: "Current Password does not match!" });
      }
    } else {
      res.status(400).json({ message: "All fields are required!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//send reset password email
const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await AuthModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.SECRET_JWT_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FORM,
        to: user.email,
        subject: "Hello this is email from Nodemailer",
        html: `<a href=${link}>Click Here</a> to Reset Your Password`,
      });
      res.status(200).json({
        status: "Success",
        message: "Password Reset Email Sent! Please Check Your Email.",
      });
    } else {
      res.status(404).json({ status: "Failed", message: "User not found!" });
    }
  } else {
    res
      .status(401)
      .json({ status: "Failed!", message: "Email Field is Required!" });
  }
};

//reset password

const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.params;
  const user = await UserModel.findById(id);
  const new_secret = user._id + process.env.SECRET_JWT_KEY;
  try {
    jwt.verify(token, new_secret);
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        res.send({
          status: "failed",
          message: "New Password and Confirm New Password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(user._id, {
          $set: { password: hashedPassword },
        });
        res.send({ status: "success", message: "Password Reset Successfully" });
      }
    } else {
      res.send({ status: "failed", message: "All Fields are Required" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: "failed", message: "Invalid Token" });
  }
};
