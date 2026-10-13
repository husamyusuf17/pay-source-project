const express = require("express");
const { create, match, list } = require("../controllers/invoiceController");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();
router.use(authenticate);
router.get("/", list);
router.post("/", authorize("FINANCE", "ADMIN"), create);
router.post("/:id/match", authorize("FINANCE", "ADMIN"), match);
module.exports = router;
