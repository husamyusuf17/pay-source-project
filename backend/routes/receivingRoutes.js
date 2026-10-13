const express = require("express");
const { create, list } = require("../controllers/receivingController");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();
router.use(authenticate);
router.get("/", list);
router.post("/", authorize("PROCUREMENT", "ADMIN"), create);
module.exports = router;
