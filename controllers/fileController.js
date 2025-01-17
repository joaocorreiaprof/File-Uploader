const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");

module.exports = {
  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      // Save file metadata to the database (optional)
      await prisma.file.create({
        data: {
          name: req.file.originalname,
          path: filePath,
        },
      });

      res.status(200).send("File uploaded successfully");
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).send("File upload failed");
    }
  },

  deleteFile: async (req, res) => {
    const { id } = req.params;

    try {
      await prisma.file.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "File deleted" });
    } catch (error) {
      console.log(error);
      res.status(200).send("Error deleting file");
    }
  },

  editFile: async (req, res) => {
    const { id } = req.params;
    const { fileName } = req.body;

    try {
      await prisma.file.update({
        where: { id: parseInt(id) },
        data: { filename: fileName },
      });
      res.status(200).send("File updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating file");
    }
  },
};
