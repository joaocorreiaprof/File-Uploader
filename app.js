const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
require("./passport-config");

// Import routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const crudRoutes = require("./routes/crudRoutes");
const folderRoutes = require("./routes/folderRoutes");

const app = express();

// Middleware for Express and Passport setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Use routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(fileRoutes);
app.use(crudRoutes);
app.use(folderRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
