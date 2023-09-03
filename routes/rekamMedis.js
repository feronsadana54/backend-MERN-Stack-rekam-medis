const express = require("express");
const router = express.Router();
const rekamMedisController = require("../controllers/rekamMedis");
const authMiddleware = require("../middlewares/authMiddlewares");

// Menambahkan rekam medis untuk user not admin
router.post(
  "/addRekamMedis",
  authMiddleware.checkAuth,
  rekamMedisController.addRekamMedisByUser
);

// konfirmasi rekam medis dari admin
router.get(
  "/daftar-rm-dikonfirmasi",
  authMiddleware.checkAuth,
  rekamMedisController.getConfirmByAdmin
);

// route get rekam medis by id
router.get(
  "/get-rekam-medis/:id",
  authMiddleware.checkAuth,
  rekamMedisController.getRekamMedisById
);

// ambil rekam medis yang sudah di konfirmasi dari admin
router.get(
  "/rekamMedisConfirm",
  authMiddleware.checkAuth,
  rekamMedisController.getRMConfirmByAdmin
);

router.put(
  "/konfirmasi-rekam-medis/:id",
  authMiddleware.checkAuth,
  rekamMedisController.confirmByAdmin
);

// Mengedit rekam medis oleh admin
router.put(
  "/:id",
  authMiddleware.checkAuth,
  rekamMedisController.editRekamMedis
);

// Menghapus rekam medis oleh admin
router.delete(
  "/:id",
  authMiddleware.checkAuth,
  rekamMedisController.deleteRekamMedis
);

// Melihat daftar user isAdmin false yang sudah melakukan rekam medis
router.get(
  "/all",
  authMiddleware.checkAuth,
  rekamMedisController.rekamMedisAll
);

module.exports = router;
