const path = require("path");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage: storage }).single("file");

module.exports = {
  editFolder: async (req, res) => {
    const { id } = req.params;
    const { folderName } = req.body;

    try {
      await prisma.folder.update({
        where: { id: parseInt(id) },
        data: { name: folderName },
      });
      res.status(200).send("Folder updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating folder");
    }
  },

  deleteFolder: async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.folder.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: "Folder deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting folder");
    }
  },

  folderPage: async (req, res) => {
    const folderId = req.params.id;

    try {
      const folderData = await prisma.folder.findUnique({
        where: { id: parseInt(folderId) },
        include: { files: true }, // Include associated files
      });

      if (!folderData) {
        return res.status(404).send("Folder not found");
      }

      res.render("folder", { folder: folderData });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching folder data");
    }
  },

  uploadFileToFolder: async (req, res) => {
    const folderId = req.params.id;

    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("File upload failed");
      }

      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      try {
        // Save file metadata in the database
        await prisma.file.create({
          data: {
            filename: req.file.originalname,
            path: req.file.path,
            folderId: parseInt(folderId),
          },
        });

        res.redirect(`/folder/${folderId}`);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error saving file to the database");
      }
    });
  },
};
