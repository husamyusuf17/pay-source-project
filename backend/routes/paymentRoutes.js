const express = require("express");
const { create } = require("../controllers/paymentController");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();
router.post("/:invoiceId", authenticate, authorize("FINANCE", "ADMIN"), create);
module.exports = router;
