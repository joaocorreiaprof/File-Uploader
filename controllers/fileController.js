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
};
