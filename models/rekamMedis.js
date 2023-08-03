// models/rekamMedis.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rekamMedisSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tanggalMedis: {
    type: Date,
    required: true,
  },
  noRekamMedis: {
    type: String,
    required: true,
    unique: true,
  },
  keterangan: {
    type: String,
  },
});

const RekamMedis = mongoose.model("rekammedis", rekamMedisSchema);

module.exports = RekamMedis;
