const bcrypt = require("bcrypt");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getSignUpForm: (req, res) => res.render("sign-up-form"),

  postSignUp: async (req, res) => {
    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { username, password: hashedPassword },
      });

      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).send("An error occurred while logging in.");
        }
        res.redirect("/");
      });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === "P2002") {
        res.status(400).send("Username already exists.");
      } else {
        res.status(500).send("An unexpected error occurred. Please try again.");
      }
    }
  },

  getLoginForm: (req, res) => res.render("log-in-form"),

  postLogin: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),

  logOut: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.redirect("/");
      });
    });
  },
};
