const express = require("express");
const router = express.Router();
const rekamMedisController = require("../controllers/rekamMedis");
const authMiddleware = require("../middleware/authMiddlewares");

// Middleware untuk semua rute rekam medis
router.use(authMiddleware.checkAuth);

// Endpoint untuk menambahkan rekam medis
router.post("/", rekamMedisController.addRekamMedis);

// Endpoint untuk mendapatkan semua rekam medis
router.get("/", rekamMedisController.getAllRekamMedis);

// Endpoint untuk mengubah rekam medis berdasarkan ID
router.put("/:rekamMedisId", rekamMedisController.editRekamMedis);

// Endpoint untuk menghapus rekam medis berdasarkan ID
router.delete("/:rekamMedisId", rekamMedisController.hapusRekamMedis);

// Endpoint untuk mendapatkan history rekam medis user
router.get("/history/:userId", rekamMedisController.historyUser);

// Endpoint untuk mengubah history rekam medis user berdasarkan ID
router.put(
  "/history/:rekamMedisId",
  rekamMedisController.editHistoryRekamMedis
);

// Endpoint untuk menghapus history rekam medis user berdasarkan ID
router.delete(
  "/history/:rekamMedisId",
  rekamMedisController.hapusHistoryRekamMedis
);

module.exports = router;
