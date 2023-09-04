// controllers/blog.js
const Blog = require("../models/blog");
const User = require("../models/user");

// Fungsi untuk menambahkan blog baru
exports.addBlog = async (req, res) => {
  try {
    const { gambarBlog, judul, artikel } = req.body;
    const user = req.user;

    // Buat blog baru
    const newBlog = new Blog({
      gambarBlog,
      penulis: user.nama,
      judul,
      artikel,
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mendapatkan semua blog
exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTopBlogs = async (req, res) => {
  try {
    const topBlogs = await Blog.find()
      .sort({
        likes: -1,
        views: -1,
      })
      .limit(10);
    res.status(200).json(topBlogs);
  } catch (error) {
    res.status(500).json({ new: "lol", message: error.message });
  }
};

// Fungsi untuk mengubah data blog
exports.editBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { gambarBlog, judul, artikel } = req.body;

    // Cari blog berdasarkan ID
    const blog = await Blog.findById(blogId);

    // Jika blog tidak ditemukan
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update data blog
    blog.gambarBlog = gambarBlog;
    blog.judul = judul;
    blog.artikel = artikel;

    // Simpan perubahan
    await blog.save();

    // Kirim respons berhasil
    res.json({ message: "Blog data updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk menghapus blog
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    // Cari blog berdasarkan ID
    const blog = await Blog.findById(blogId);

    // Jika blog tidak ditemukan
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Hapus blog
    await blog.deleteOne();

    // Kirim respons berhasil
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk menambahkan like pada blog
exports.addLike = async (req, res) => {
  const { blogId } = req.params;
  const { liked } = req.body;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (liked) {
      blog.likes += 1;
    }

    await blog.save();

    res.status(200).json({ message: "Like status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk menambahkan comment pada blog
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { comment, userId, penulis, profile } = req.body;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    blog.comments.push({
      user: user._id,
      comment,
      penulis: user.nama,
      profile: user.fotoProfil,
    });

    await blog.save();

    res.json({ message: "Comment added successfully", data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mengedit comment pada blog
exports.editComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;
    const { comment } = req.body;

    // Cari blog berdasarkan ID
    const blog = await Blog.findById(blogId);

    // Jika blog tidak ditemukan
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cari comment berdasarkan ID
    const foundComment = blog.comments.find(
      (c) => c._id.toString() === commentId
    );

    // Jika comment tidak ditemukan
    if (!foundComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update comment
    foundComment.comment = comment;

    // Simpan perubahan
    await blog.save();

    // Kirim respons berhasil
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk menghapus comment pada blog
exports.deleteComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;

    // Cari blog berdasarkan ID
    const blog = await Blog.findById(blogId);

    // Jika blog tidak ditemukan
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cari comment berdasarkan ID
    const foundComment = blog.comments.find(
      (c) => c._id.toString() === commentId
    );

    // Jika comment tidak ditemukan
    if (!foundComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Jika user yang sedang login bukan yang membuat comment
    if (foundComment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Access denied" });
    }

    // Hapus comment dari blog
    blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId);

    // Simpan perubahan
    await blog.save();

    // Kirim respons berhasil
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  const { blogId } = req.params;
  try {
    await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });

    const data = await Blog.findById(blogId);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
