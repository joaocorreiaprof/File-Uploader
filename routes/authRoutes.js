const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

// Log-in route

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/", // Redirect to home after successful login
    failureRedirect: "/log-in", // Redirect to login page if authentication fails
    failureFlash: true, // Flash message on failure (if you have it configured)
  })
);

//Sign-up route
router.get("/sign-up", authController.getSignUpForm);

//Log-in route

router.get("/log-in", authController.getLoginForm);

// Log-out route
router.get("/log-out", authController.logOut);

// POST route for handling user sign-up
router.post("/sign-up", authController.postSignUp);

module.exports = router;
