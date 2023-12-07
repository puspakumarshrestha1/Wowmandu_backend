const jwt = require("jsonwebtoken");
const AuthModel = require("../models/Auth")

const verifyAdminAuthentication = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //get token from header
      token = authorization.split(" ")[1];
      //verify token
      const { userID } = jwt.verify(token, process.env.SECRET_JWT_KEY);
      //GET USER FROM TOKEN
      req.user = await AuthModel.findById(userID).select("-password");
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(401).json({ message: "You are not Authorized!" });
      }
    } catch (error) {
      res.status(401).send({ status: "Failed", message: "Unauthorized User!" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "Failed", message: "Unauthorized User, No token!" });
  }
};

module.exports = verifyAdminAuthentication;