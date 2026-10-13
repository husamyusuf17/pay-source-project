const express = require("express");
const { dashboard, requestDetails } = require("../controllers/bffController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();
router.use(authenticate);
router.get("/dashboard", dashboard);
router.get("/purchase-requests/:id/details", requestDetails);
module.exports = router;
