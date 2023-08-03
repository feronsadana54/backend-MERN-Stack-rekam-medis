// controllers/blog.js
const Blog = require("../models/blog");
const User = require("../models/user");

// Fungsi untuk menambahkan blog baru
exports.addBlog = async (req, res) => {
  try {
    const { gambarBlog, judul, artikel, konten } = req.body;

    // Buat blog baru
    const newBlog = new Blog({
      gambarBlog,
      judul,
      artikel,
      konten,
    });

    // Simpan blog baru ke database
    await newBlog.save();

    res.status(201).json({ message: "Blog added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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

// Fungsi untuk mengubah data blog
exports.editBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { gambarBlog, judul, artikel, konten } = req.body;

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
    blog.konten = konten;

    // Simpan perubahan
    await blog.save();

    // Kirim respons berhasil
    res.json({ message: "Blog data updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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
  try {
    const blogId = req.params.blogId;

    // Cari blog berdasarkan ID
    const blog = await Blog.findById(blogId);

    // Jika blog tidak ditemukan
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Tambah jumlah likes
    blog.likes += 1;

    // Simpan perubahan
    await blog.save();

    // Kirim respons berhasil
    res.json({ message: "Like added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk menambahkan comment pada blog
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { comment, userId } = req.body;

    // Cari blog berdasarkan ID
    const blog = await Blog.findById(blogId);

    // Jika blog tidak ditemukan
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cari user yang sedang membuat comment
    const user = await User.findById(userId);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tambah comment ke blog
    blog.comments.push({ user: user._id, comment });

    // Simpan perubahan
    await blog.save();

    // Kirim respons berhasil
    res.json({ message: "Comment added successfully" });
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
