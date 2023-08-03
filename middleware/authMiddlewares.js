const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// Middleware untuk melakukan otentikasi pengguna dengan token
exports.checkAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied, missing token" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access denied, invalid token" });
  }
};

// Middleware untuk memastikan pengguna adalah admin
exports.checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied, admin privilege required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
