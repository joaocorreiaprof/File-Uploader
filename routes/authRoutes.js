// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

// Sign-up and login routes
router.get("/sign-up", authController.getSignUpForm);
router.get("/log-in", authController.getLoginForm);

// Handle the login POST request with the postLogin function from the controller
router.post("/log-in", authController.postLogin);

// Log-out route
router.get("/log-out", authController.logOut);

// Handle the user sign-up
router.post("/sign-up", authController.postSignUp);

module.exports = router;
