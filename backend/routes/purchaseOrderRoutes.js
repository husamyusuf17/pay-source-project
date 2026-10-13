const express = require("express");
const { createFromRFQ, list } = require("../controllers/purchaseOrderController");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();
router.use(authenticate);
router.get("/", list);
router.post("/from-rfq/:rfqId", authorize("PROCUREMENT", "ADMIN"), createFromRFQ);
module.exports = router;
