const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Menggunakan body-parser untuk membaca data dalam request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Menggunakan cors untuk mengizinkan request dari semua domain
app.use(cors());

// Koneksi ke database MongoDB
// const dbURL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rekamMedis";
const dbURL = process.env.MONGODB_URI;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Menambahkan routes ke aplikasi
const usersRoutes = require("../backend/routes/users");
const rekamMedisRoutes = require("../backend/routes/rekamMedis");
const blogRoutes = require("../backend/routes/blog");

app.use("/api/users", usersRoutes);
app.use("/api/rekam-medis", rekamMedisRoutes);
app.use("/api/blog", blogRoutes);

// Error handling untuk route tidak ditemukan
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handling untuk error lainnya
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
