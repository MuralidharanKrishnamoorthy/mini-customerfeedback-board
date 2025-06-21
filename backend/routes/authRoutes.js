const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

router.post("/register", register);  // For users only
router.post("/login", login);        // For both admin/user

module.exports = router;
