// routes/blogRoutes.js
const express = require("express");
const blogController = require("../controllers/blog");
const authMiddleware = require("../middlewares/authMiddlewares");

const router = express.Router();

// Endpoint untuk menambahkan blog baru
router.post("/", authMiddleware.checkAuth, blogController.addBlog);

// Endpoint untuk mendapatkan semua blog
router.get("/", blogController.getAllBlog);

// Endpoint untuk mengubah data blog
router.put("/:blogId", authMiddleware.checkAuth, blogController.editBlog);

// Endpoint untuk menghapus blog
router.delete("/:blogId", authMiddleware.checkAuth, blogController.deleteBlog);

// Endpoint untuk menambahkan like pada blog
router.post("/:blogId/like", authMiddleware.checkAuth, blogController.addLike);

// Endpoint untuk menambahkan comment pada blog
router.post(
  "/:blogId/comment",
  authMiddleware.checkAuth,
  blogController.addComment
);

// Endpoint untuk mengedit comment pada blog
router.put(
  "/:blogId/comment/:commentId",
  authMiddleware.checkAuth,
  blogController.editComment
);

// Endpoint untuk menghapus comment pada blog
router.delete(
  "/:blogId/comment/:commentId",
  authMiddleware.checkAuth,
  blogController.deleteComment
);

module.exports = router;
