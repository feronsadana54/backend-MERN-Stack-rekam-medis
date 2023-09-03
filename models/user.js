const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tanggalLahir: {
    type: Date,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  alamat: {
    type: String,
  },
  nomorHandphone: {
    type: String,
  },
  noIdentitas: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fotoProfil: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
