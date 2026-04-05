const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");
const { checkRole } = require("../middleware/roleMiddleware");

// Only admin can manage users
router.post("/", userController.createUser);
router.get("/", checkRole(["admin"]), userController.getUsers);
router.patch("/:id", checkRole(["admin"]), userController.updateUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

module.exports = router;