const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getUserFolders: async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.redirect("/log-in"); // Or redirect to the appropriate page
      }

      const folders = await prisma.folder.findMany({
        where: {
          userId: req.user.id,
        },
      });

      // Pass 'folders' to the EJS template
      res.render("index", { folders, user: req.user });
    } catch (error) {
      console.log("Error fetching folders:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  createUserFolder: async (req, res) => {
    try {
      const { folderName } = req.body;
      await prisma.folder.create({
        data: {
          name: folderName,
          userId: req.user.id,
        },
      });
      res.redirect("/");
    } catch (error) {
      console.log("Error creating folder:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
