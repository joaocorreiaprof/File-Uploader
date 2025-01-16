const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");

// Log-in route
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  })
);

// Log-out route
router.get("/log-out", authController.logOut);

// POST route for handling user sign-up
router.post("/sign-up", authController.postSignUp);

module.exports = router;
