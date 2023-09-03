const RekamMedis = require("../models/rekamMedis");
const SubRekamMedis = require("../models/subRekamMedis");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

const kirimEmail = async (
  nama,
  tanggalPemeriksaan,
  pesan,
  penerima,
  keterangan
) => {
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
      intro: "Permintaan Pemeriksaan Rekam Medis",
      table: {
        data: [
          {
            tanggal: tanggalPemeriksaan,
            pesan,
            keterangan,
          },
        ],
      },
      outro: "Terima kasih telah melakukan pemeriksaan :)",
    },
  };

  const notes = mailGenerator.generate(mail);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: penerima,
    subject: "Permintaan Pemeriksaan Rekam Medis",
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
  const reminderDate = new Date(tanggalPemeriksaan);
  reminderDate.setDate(reminderDate.getDate() - 3);

  const now = new Date();
  if (now <= reminderDate) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      } else {
        return `Email sent: ${info.response}`;
      }
    });
  }
};

const addSubRekamMedis = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, tanggalPemeriksaanSelanjutnya, keterangan } = req.body;
    let { pesan } = req.body;
    const user = req.user;
    const findRekamMedis = await RekamMedis.findById(id);
    const tanggal = new Date(tanggalPemeriksaanSelanjutnya);
    if (user.isAdmin == false) {
      res.status(404).json({ message: "URL Not Found!" });
    } else {
      const addSubRkmMedis = new SubRekamMedis({
        idRekamMedis: id,
        tanggalPemeriksaanSelanjutnya: tanggal,
        nama,
        keterangan,
      });

      if (req.body.pesan == null || req.body.pesan == "") {
        pesan = `Terima kasih anda telah melakukan pemeriksaan. untuk pemeriksaan selanjutnya pada tanggal ${tanggalPemeriksaanSelanjutnya}.`;
      } else if (
        req.body.pesan == null &&
        tanggalPemeriksaanSelanjutnya == null
      ) {
        pesan = `Terima kasih anda telah melakukan pemeriksaan. semoga harimu menyenangkan :).`;
      }

      kirimEmail(
        findRekamMedis.nama,
        tanggalPemeriksaanSelanjutnya,
        pesan,
        findRekamMedis.email,
        keterangan
      );

      await addSubRkmMedis.save();
      res
        .status(201)
        .json({ message: "Berhasil menambahkan sub rekam medis!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editSubRekamMedis = async (req, res) => {
  try {
    const { id, idSub } = req.params;
    const { nama, keterangan, tanggalPemeriksaan } = req.body;
    const { isAdmin } = req.user;
    const findRkm = await RekamMedis.findById(id);
    const findSubRkm = await SubRekamMedis.findById(idSub);
    const date = new Date(tanggalPemeriksaan);
    console.log(date);
    if (isAdmin == false) {
      res.status(404).json({ message: "URL tidak ditemukan" });
    } else {
      if (tanggalPemeriksaan != null) {
        const pesan = `Terjadi perubahan jadwal pemeriksaan. untuk pemeriksaan selanjutnya tanggal ${tanggalPemeriksaan}.`;
        kirimEmail(
          findRkm.nama,
          tanggalPemeriksaan,
          pesan,
          findRkm.email,
          keterangan
        );
        findSubRkm.tanggalPemeriksaanSelanjutnya = date;
      }
      findSubRkm.nama = nama;
      findSubRkm.keterangan = keterangan;
      await findSubRkm.save();

      res.status(200).json({ message: "Sub Rekam Medis berhasil di ubah!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Sub Rekam Medis By Id
const getSubRekamMedisById = async (req, res) => {
  try {
    const { id } = req.params;
    const findSubRekamMedis = await SubRekamMedis.find({ idRekamMedis: id });
    if (findSubRekamMedis.length <= 0) {
      res.json({
        message: "Data kosong / belum diisi silahkan lakukan pemeriksaan",
        data: findSubRekamMedis,
      });
    } else {
      res.status(200).json({
        message: "Berhasil mengambil data.",
        data: findSubRekamMedis,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// / Get Sub Rekam Medis By ID For Edit
const getSubRekamMedisByIdForEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const findSubRekamMedis = await SubRekamMedis.findById(id);
    res.status(200).json({
      message: "Berhasil mengambil data.",
      data: findSubRekamMedis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubRekamMedisById = async (req, res) => {
  try {
    const { idSub } = req.params;
    const { isAdmin } = req.user;
    if (isAdmin) {
      const getSub = await SubRekamMedis.findById(idSub);
      await getSub.deleteOne();
      res.status(200).json({
        message: "Riwayat rekam medis berhasil dihapus!",
      });
    } else {
      res.status(404).json({ message: "URL tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSubRekamMedis,
  editSubRekamMedis,
  getSubRekamMedisById,
  deleteSubRekamMedisById,
  getSubRekamMedisByIdForEdit,
};
