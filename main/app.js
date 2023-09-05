const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

const dbURL = process.env.MONGODB_URI;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const usersRoutes = require("./../routes/users");
const rekamMedisRoutes = require("./../routes/rekamMedis");
const blogRoutes = require("./../routes/blog");
const subRekamMedisRoutes = require("./../routes/subRekamMedis");

app.use("/api/users", usersRoutes);
app.use("/api/rekam-medis", rekamMedisRoutes);
app.use("/api/sub-rekam-medis", subRekamMedisRoutes);
app.use("/api/blog", blogRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
