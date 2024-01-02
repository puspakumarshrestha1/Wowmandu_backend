const AuthModel = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../configs/emailConfig");

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
          const hashedPassword = await bcrypt.hash(password, salt);
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
        res.status(404).json({ message: "No user found with this email!" });
      } else {
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (existingUser.email === email && isMatch) {
          const token = jwt.sign(
            { userID: existingUser._id },
            process.env.SECRET_JWT_KEY,
            { expiresIn: "5d" }
          );
          res
            .status(200)
            .json({ message: "Logged in successfully!", token: token });
        } else {
          res
            .status(400)
            .json({ message: "Email or Password does not match!" });
        }
      }
    } else {
      res.status(400).json({ message: "All fields are required!" });
    }
  } catch (error) {
    res.status(500).json({ error, message: "Unable to Login" });
  }
};

// change password by logged in user

const changePassword = async (req, res) => {
  const { newPassword, confirmNewPassword, currentPassword, email } = req.body;
  try {
    const user = await AuthModel.findOne({ email: email });
    const isMatch = await bcrypt.compare(currentPassword, user.password); //compare previous password
    if (newPassword && confirmNewPassword && isMatch) {
      if (isMatch) {
        if (newPassword === confirmNewPassword) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          //save new password
          await AuthModel.findByIdAndUpdate(req.user._id, {
            $set: { password: hashedPassword },
          });
          res.status(200).json({ message: "Password changed successfully!" });
          console.log("Password changed successfully!")
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
    res.status(500).json({ message: "Internal server error", error });
    console.log("Something went wrong!", error)

  }
};

//send reset password email
const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  if (email) {
    const user = await AuthModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.SECRET_JWT_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://127.0.0.1:5173/reset-password/${user._id}/${token}`;
      console.log(link);
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FORM,
        to: user.email,
        subject: "Reset email from WoWMandu to change your password!",
        html: `<a href=${link}>Click Here</a> to Reset Your Password`,
      });
      res.status(200).json({
        userID: user._id,
        token: token,
        status: "Success",
        message: "Password Reset Email Sent! Please Check Your Email.",
        info: info,
      });
      console.log("ResetEmailSent")
    } else {
      res.status(404).json({ status: "Failed", message: "User not found!" });
    }
  } else {
    res
      .status(401)
      .json({ status: "Failed!", message: "Email Field is Required!" });
    console.log("Error")
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

//admin profile
const showAdminProfile = async (req, res) => {
  try {
    const getAdminInfo = await AuthModel.find({}, { password: 0, _id: 0 });
    res
      .status(200)
      .json({ message: "Your profile information.", profile: getAdminInfo });
  } catch (error) {
    res.status(500).json({ error, message: "Internal server error!" });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  sendPasswordResetEmail,
  resetPassword,
  showAdminProfile,
};
