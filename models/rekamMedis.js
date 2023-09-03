const mongoose = require("mongoose");

const rekamMedisSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nama: {
      type: String,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      ref: "User",
      required: true,
    },
    alamat: {
      type: String,
      ref: "User",
    },
    nomorHandphone: {
      type: String,
      ref: "User",
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RekamMedis = mongoose.model("RekamMedis", rekamMedisSchema);

module.exports = RekamMedis;
