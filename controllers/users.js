const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Fungsi untuk registrasi (sign up) pengguna
exports.registerUser = async (req, res) => {
  try {
    const {
      nama,
      email,
      username,
      password,
      tanggalLahir,
      alamat,
      nomorHandphone,
      noIdentitas,
    } = req.body;

    // Cek apakah email atau username sudah terdaftar sebelumnya
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Enkripsi password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru ke database
    const newUser = await User.create({
      nama,
      email,
      username,
      password: hashedPassword,
      tanggalLahir,
      alamat,
      nomorHandphone,
      noIdentitas,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk login (sign in) pengguna
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari pengguna berdasarkan username
    const user = await User.findOne({ username });

    // Jika pengguna tidak ditemukan atau password tidak cocok, beri respon error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Buat token JWT untuk pengguna yang berhasil login
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      nama,
      email,
      isAdmin,
      tanggalLahir,
      alamat,
      nomorHandphone,
      noIdentitas,
    } = req.body;

    // Cari user berdasarkan ID
    const user = await User.findById(userId);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update data pengguna
    user.nama = nama;
    user.email = email;
    user.isAdmin = isAdmin;
    user.tanggalLahir = tanggalLahir;
    user.alamat = alamat;
    user.nomorHandphone = nomorHandphone;
    user.noIdentitas = noIdentitas;

    // Simpan perubahan
    await user.save();

    // Kirim respons berhasil
    res.json({ message: "User data updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mengubah password pengguna
exports.changePassword = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    // Cari user berdasarkan ID
    const user = await User.findById(userId);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Periksa apakah currentPassword sesuai dengan password yang disimpan di database
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    // Jika password tidak sesuai
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;

    // Simpan perubahan
    await user.save();

    // Kirim respons berhasil
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Cari user berdasarkan ID
    const user = await User.findById(userId);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hapus user
    await user.deleteOne();

    // Kirim respons berhasil
    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
