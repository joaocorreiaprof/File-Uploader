const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

// Log-in route
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-up",
    failureFlash: true,
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
