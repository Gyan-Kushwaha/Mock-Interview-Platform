const express = require("express");
const { healthCheck } = require("../controllers/health.controller");

const router = express.Router();

// Route is now GET /api/v1/health/
router.get("/", healthCheck);

module.exports = router;