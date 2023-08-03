// controllers/rekamMedis.js
const RekamMedis = require("../models/rekamMedis");
const User = require("../models/user");

// Fungsi untuk menambahkan rekam medis baru
exports.addRekamMedis = async (req, res) => {
  try {
    const { idUser, tanggalMedis, noRekamMedis, keterangan } = req.body;
    // Cek apakah noRekamMedis sudah ada di database
    const existingRekamMedis = await RekamMedis.findOne({ noRekamMedis });
    if (existingRekamMedis) {
      return res.status(400).json({ message: "No Rekam Medis already exists" });
    }

    // Buat rekam medis baru
    const newRekamMedis = new RekamMedis({
      idUser,
      tanggalMedis,
      noRekamMedis,
      keterangan,
    });

    // Simpan rekam medis baru ke database
    await newRekamMedis.save();

    res.status(201).json({ message: "Rekam Medis added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mendapatkan semua rekam medis
exports.getAllRekamMedis = async (req, res) => {
  try {
    const rekamMedis = await RekamMedis.find();
    res.json(rekamMedis);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk mengubah data rekam medis
exports.editRekamMedis = async (req, res) => {
  try {
    const rekamMedisId = req.params.rekamMedisId;
    const { tanggalMedis, noRekamMedis, keterangan } = req.body;

    // Cari rekam medis berdasarkan ID
    const rekamMedis = await RekamMedis.findById(rekamMedisId);

    // Jika rekam medis tidak ditemukan
    if (!rekamMedis) {
      return res.status(404).json({ message: "Rekam Medis not found" });
    }

    // Update data rekam medis
    rekamMedis.tanggalMedis = tanggalMedis;
    rekamMedis.noRekamMedis = noRekamMedis;
    rekamMedis.keterangan = keterangan;

    // Simpan perubahan
    await rekamMedis.save();

    // Kirim respons berhasil
    res.json({ message: "Rekam Medis data updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk menghapus rekam medis
exports.hapusRekamMedis = async (req, res) => {
  try {
    const rekamMedisId = req.params.rekamMedisId;

    // Cari rekam medis berdasarkan ID
    const rekamMedis = await RekamMedis.findById(rekamMedisId);

    // Jika rekam medis tidak ditemukan
    if (!rekamMedis) {
      return res.status(404).json({ message: "Rekam Medis not found" });
    }

    // Hapus rekam medis
    await rekamMedis.deleteOne();

    // Kirim respons berhasil
    res.json({ message: "Rekam Medis deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk mendapatkan history rekam medis untuk user tertentu
exports.historyUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Cari user berdasarkan ID
    const user = await User.findById(userId);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cari semua rekam medis yang terkait dengan user
    const rekamMedis = await RekamMedis.find({ idUser: userId });

    // Kirim respons
    res.json({ user, rekamMedis });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk mengubah data history rekam medis
exports.editHistoryRekamMedis = async (req, res) => {
  try {
    const rekamMedisId = req.params.rekamMedisId;
    const { tanggalMedis, noRekamMedis, keterangan } = req.body;

    // Cari rekam medis berdasarkan ID
    const rekamMedis = await RekamMedis.findById(rekamMedisId);

    // Jika rekam medis tidak ditemukan
    if (!rekamMedis) {
      return res.status(404).json({ message: "Rekam Medis not found" });
    }

    // Update data rekam medis
    rekamMedis.tanggalMedis = tanggalMedis;
    rekamMedis.noRekamMedis = noRekamMedis;
    rekamMedis.keterangan = keterangan;

    // Simpan perubahan
    await rekamMedis.save();

    // Kirim respons berhasil
    res.json({ message: "Rekam Medis data updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk menghapus history rekam medis
exports.hapusHistoryRekamMedis = async (req, res) => {
  try {
    const rekamMedisId = req.params.rekamMedisId;

    // Cari rekam medis berdasarkan ID
    const rekamMedis = await RekamMedis.findById(rekamMedisId);

    // Jika rekam medis tidak ditemukan
    if (!rekamMedis) {
      return res.status(404).json({ message: "Rekam Medis not found" });
    }

    // Hapus rekam medis
    await rekamMedis.deleteOne();

    // Kirim respons berhasil
    res.json({ message: "Rekam Medis deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
