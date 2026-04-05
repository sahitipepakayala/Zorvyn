const express = require("express");
const router = express.Router();

const recordController = require("../Controllers/recordController");
const { checkRole } = require("../middleware/roleMiddleware");

// Admin only
router.post("/", checkRole(["admin"]), recordController.createRecord);
router.put("/:id", checkRole(["admin"]), recordController.updateRecord);
router.delete("/:id", checkRole(["admin"]), recordController.deleteRecord);

// Admin + Analyst + Viewer can view
router.get("/", checkRole(["admin", "analyst", "viewer"]), recordController.getRecords);

module.exports = router;