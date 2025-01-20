const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Configure the local strategy for Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Authenticating user:", username); // Log the username being authenticated

      const user = await prisma.user.findUnique({ where: { username } });
      console.log("User found:", user); // Log the user found in the database

      if (!user) {
        console.log("User not found");
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      console.log("Password comparison result:", match); // Log the result of password comparison

      if (match) {
        console.log("Authentication successful");
        return done(null, user);
      } else {
        console.log("Incorrect password");
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (error) {
      console.error("Error during authentication:", error); // Log errors during authentication
      return done(error);
    }
  })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); // Log the user being serialized
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id); // Log the user ID being deserialized

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    console.log("User deserialized:", user); // Log the user data after deserialization
    done(null, user);
  } catch (error) {
    console.error("Error during deserialization:", error); // Log errors during deserialization
    done(error);
  }
});
