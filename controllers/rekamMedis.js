const RekamMedis = require("../models/rekamMedis");
const SubRekamMedis = require("../models/subRekamMedis");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

const kirimEmail = async (nama, tanggal, pesan, penerima) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Poli Bidan",
      link: "https://mailgen.js/",
    },
  });

  const mail = {
    body: {
      name: nama,
      intro: "Permintaan Konfirmasi Rekam Medis",
      table: {
        data: [
          {
            pesan,
          },
        ],
      },
      outro: "Terima kasih",
    },
  };

  const notes = mailGenerator.generate(mail);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: penerima,
    subject: "Permintaan Konfirmasi Pemeriksaan Rekam Medis",
    html: notes,
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    } else {
      return "Email berhasil dikirim!";
    }
  });

  // Kirim email pengingat 3 hari sebelum tanggal pemeriksaan
  const reminderDate = new Date(tanggal);
  reminderDate.setDate(reminderDate.getDate() - 3);

  let now = new Date();
  let nowDate = now.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  if (nowDate <= reminderDate) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      } else {
        return `Email sent: ${info.response}`;
      }
    });
  }
};

const addRekamMedisByUser = async (req, res) => {
  const user = req.user;
  const idUser = user._id;
  const date = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });
  try {
    const findRekamMedis = await RekamMedis.find({ idUser });
    if (findRekamMedis.length > 0) {
      res.status(406).json({
        message:
          "Anda sudah meminta jadwal rekam medis. harap menunggu konfirmasi.",
      });
    } else {
      if (user.isAdmin === false) {
        const addRekamMedis = new RekamMedis({
          idUser: user._id,
          nama: user.nama,
          email: user.email,
          alamat: user.alamat,
          nomorHandphone: user.nomorHandphone,
        });
        await addRekamMedis.save();
        await kirimEmail(
          user.nama,
          date,
          "Rekam medis sedang dibuat. Diharapkan dalam tiga hari kedepan anda melakukan konfirmasi di poli bidan.",
          user.email
        );
        res
          .status(201)
          .json({ data: addRekamMedis, message: "add data successfully" });
      } else {
        res.status(406).json({
          message:
            "anda adalah pegawai, tolong konfirmasi rekam medis yang ada",
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengambil semua data yang belum dikonfirmasi
const getConfirmByAdmin = async (req, res) => {
  try {
    const findRekamMedis = await RekamMedis.find({ isConfirm: false });
    res.status(200).json({ data: findRekamMedis });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mengambil semua data yang sudah dikonfirmasi
const getRMConfirmByAdmin = async (req, res) => {
  const user = req.user;
  try {
    if (user.isAdmin == true) {
      const findRekamMedis = await RekamMedis.find({ isConfirm: true });
      res.status(200).json({ data: findRekamMedis });
    } else {
      res.status(404).json({ message: "URL tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// konfimasi admin
const confirmByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const date = new Date();
    if (user.isAdmin == true) {
      const rmById = await RekamMedis.findById(id);
      rmById.isConfirm = true;
      await rmById.save();
      await kirimEmail(
        rmById.nama,
        date,
        "Rekam medis sudah dikonfirmasi. Silahkan melakukan pemeriksaan :)",
        rmById.email
      );
      res.status(200).json({ message: "Rekam Medis sudah dikonfirmasi!" });
    } else {
      res.status(404).json({ message: "URL tidak tersedia" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fungsi untuk mengambil rekam medis by id
const getRekamMedisById = async (req, res) => {
  const { id } = req.params;
  try {
    const findRekamMedis = await RekamMedis.find({ idUser: id });
    res.status(200).json({
      data: findRekamMedis,
      message: "Data Berhasil diambil",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk mengedit rekam medis oleh admin
const editRekamMedis = async (req, res) => {
  const { id } = req.params;
  const { alamat, nomorHandphone } = req.body;
  const { isAdmin } = req.user;

  try {
    const rekamMedis = await RekamMedis.findById(id);
    if (!rekamMedis) {
      return res.status(404).json({ message: "Rekam medis tidak ditemukan" });
    }

    if (isAdmin == false) {
      res.status(404).json({ message: "URL tidak tersedia" });
    } else {
      // Update keterangan dan tanggal pemeriksaan selanjutnya
      rekamMedis.alamat = alamat;
      rekamMedis.nomorHandphone = nomorHandphone;
      await rekamMedis.save();

      res.status(200).json({ message: "Rekam medis berhasil diubah" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk menghapus rekam medis oleh admin
const deleteRekamMedis = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.user;
    const rekamMedis = await RekamMedis.findById(id);
    if (!rekamMedis) {
      return res.status(404).json({ message: "Rekam medis tidak ditemukan" });
    }
    if (isAdmin) {
      // Hapus rekam medis
      await rekamMedis.deleteOne();
      await SubRekamMedis.deleteMany({ idRekamMedis: id });
      res.status(200).json({ message: "Rekam medis berhasil dihapus" });
    } else {
      res.status(404).json({ message: "URL tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fungsi untuk melihat daftar user isAdmin false yang sudah melakukan rekam medis
const rekamMedisAll = async (req, res) => {
  try {
    const { isAdmin } = req.user;
    if (isAdmin) {
      const rekamMedis = await RekamMedis.find();
      res.status(200).json({ data: rekamMedis });
    } else {
      res.status(404).json({ message: "URL tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addRekamMedisByUser,
  getConfirmByAdmin,
  getRMConfirmByAdmin,
  confirmByAdmin,
  editRekamMedis,
  deleteRekamMedis,
  rekamMedisAll,
  getRekamMedisById,
};
