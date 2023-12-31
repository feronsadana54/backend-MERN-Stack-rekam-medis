const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const authMiddleware = require("../middlewares/authMiddlewares");

// Register User
router.post("/register", userController.registerUser);

// Login User
router.post("/login", userController.loginUser);

// Get All Users (requires authentication)
router.get("/getAll", authMiddleware.checkAuth, userController.getAllUsers);

// Get All Users Admin (requires authentication)
router.get(
  "/get-user-admin",
  authMiddleware.checkAuth,
  userController.getAllUsersAdmin
);

// Get All Users Not Admin (requires authentication)
router.get(
  "/get-user-not-admin",
  authMiddleware.checkAuth,
  userController.getAllUsersNotAdmin
);

// Get Data By Id
router.get("/:userId", authMiddleware.checkAuth, userController.getUserById);

// Get Change Admin (requires authentication)
router.put(
  "/change-admin/:idUser",
  authMiddleware.checkAuth,
  userController.changeAdmin
);

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
