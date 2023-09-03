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
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { noIdentitas }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Email, username atau nomor identitas sudah digunakan.",
      });
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
      fotoProfil: "",
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
      return res.status(401).json({ message: "Username atau password salah!" });
    }

    // Buat token JWT untuk pengguna yang berhasil login
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        nama: user.nama,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

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

exports.getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: true }, "-password");
    res.status(200).json({ message: "Data Berhasil di ambil", data: users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllUsersNotAdmin = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }, "-password");
    res.status(200).json({ message: "Data Berhasil di ambil", data: users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.status(200).json({ message: "Get Data Sucessfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      nama,
      email,
      username,
      tanggalLahir,
      alamat,
      nomorHandphone,
      noIdentitas,
      fotoProfil,
    } = req.body;

    // Cari user berdasarkan ID
    const user = await User.findById(userId);

    // Cek apakah email atau username sudah terdaftar sebelumnya
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { noIdentitas }],
    });
    if (existingUser) {
      if (username == existingUser.username) {
        user.username = existingUser.username;
      } else {
        user.username = username;
      }
      if (email == existingUser.email) {
        user.email = existingUser.email;
      } else {
        user.email = email;
      }
      if (noIdentitas == existingUser.noIdentitas) {
        user.noIdentitas = existingUser.noIdentitas;
      } else {
        user.noIdentitas = noIdentitas;
      }
    }
    user.nama = nama;
    user.tanggalLahir = tanggalLahir;
    user.alamat = alamat;
    user.nomorHandphone = nomorHandphone;
    user.fotoProfil = fotoProfil;
    await user.save();
    res.json({ message: "User data updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeAdmin = async (req, res) => {
  try {
    const { idUser } = req.params;
    const user = req.user;
    if (user.isAdmin == false) {
      res.status(404).json({ message: "URL tidak ditemukan" });
    } else {
      const findUser = await User.findById(idUser);
      if (findUser.isAdmin == true) {
        findUser.isAdmin = false;
      } else {
        findUser.isAdmin = true;
      }
      await findUser.save();
      res.status(200).json({ message: "User isAdmin sudah berubah!" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
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
