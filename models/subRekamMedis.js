const mongoose = require("mongoose");

const subRekamMedisSchema = new mongoose.Schema(
  {
    idRekamMedis: {
      type: mongoose.Types.ObjectId,
      ref: "RekamMedis",
      required: true,
    },
    tanggalPemeriksaan: {
      type: Date,
      default: Date.now,
    },
    nama: {
      type: String,
      required: true,
    },
    keterangan: {
      type: String,
      default: "",
    },
    tanggalPemeriksaanSelanjutnya: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const SubRekamMedis = mongoose.model("SubRekamMedis", subRekamMedisSchema);
module.exports = SubRekamMedis;
