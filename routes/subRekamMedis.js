const express = require("express");
const router = express.Router();
const subRekamMedis = require("../controllers/subRekamMedis");
const authMiddleware = require("../middlewares/authMiddlewares");

// menambahkan sub rekam medis
router.post(
  "/:id/add-sub-rekam-medis",
  authMiddleware.checkAuth,
  subRekamMedis.addSubRekamMedis
);

router.put(
  "/:id/edit-sub-rekam-medis/:idSub",
  authMiddleware.checkAuth,
  subRekamMedis.editSubRekamMedis
);

router.get(
  "/:id",
  authMiddleware.checkAuth,
  subRekamMedis.getSubRekamMedisById
);

router.get(
  "/sub-rm/:id",
  authMiddleware.checkAuth,
  subRekamMedis.getSubRekamMedisByIdForEdit
);

router.delete(
  "/hapus/:idSub",
  authMiddleware.checkAuth,
  subRekamMedis.deleteSubRekamMedisById
);

module.exports = router;
