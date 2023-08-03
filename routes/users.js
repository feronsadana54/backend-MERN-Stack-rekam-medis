const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const authMiddleware = require("../middleware/authMiddlewares");

// Register User
router.post("/register", userController.registerUser);

// Login User
router.post("/login", userController.loginUser);

// Get All Users (requires authentication)
router.get("/getAll", authMiddleware.checkAuth, userController.getAllUsers);

// Edit User (requires authentication)
router.put(
  "/editUser/:userId",
  authMiddleware.checkAuth,
  userController.editUser
);

// Route untuk mengubah password pengguna
router.put(
  "/changePassword/:userId",
  authMiddleware.checkAuth,
  userController.changePassword
);

// Delete User (requires authentication)
router.delete("/:userId", authMiddleware.checkAuth, userController.deleteUser);

module.exports = router;
