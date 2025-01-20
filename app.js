const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default; // Ensure the default export is used
const redis = require("redis");
const passport = require("passport");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// Import routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const crudRoutes = require("./routes/crudRoutes");
const folderRoutes = require("./routes/folderRoutes");

// Import passport configuration
require("./passport-config");

const app = express();

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .catch((err) => console.error("Redis connection failed:", err));

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
    store: new RedisStore({
      client: redisClient, // Use Redis for session store
    }),
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
