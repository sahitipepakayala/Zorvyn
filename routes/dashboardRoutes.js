const express = require("express");
const router = express.Router();

const dashboardController = require("../Controllers/dashboardController");
const { checkRole } = require("../middleware/roleMiddleware");

// Admin + Analyst only
router.get("/summary", checkRole(["admin", "analyst", "viewer"]), dashboardController.getSummary);

module.exports = router;