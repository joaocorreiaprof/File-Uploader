const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../cloudinary");

module.exports = {
  deleteFile: async (req, res) => {
    const { id } = req.params;

    try {
      const file = await prisma.file.findUnique({
        where: { id: parseInt(id) },
      });

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      if (file.cloudinary_public_id) {
        await cloudinary.uploader.destroy(file.cloudinary_public_id);
      }

      await prisma.file.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting file" });
    }
  },

  editFile: async (req, res) => {
    const { id } = req.params;
    const { fileName } = req.body;

    try {
      const file = await prisma.file.findUnique({
        where: { id: parseInt(id) },
      });

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      await prisma.file.update({
        where: { id: parseInt(id) },
        data: { filename: fileName },
      });

      res.status(200).json({ message: "File updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating file" });
    }
  },

  downloadFile: async (req, res) => {
    const { id } = req.params;

    try {
      const file = await prisma.file.findUnique({
        where: { id: parseInt(id) },
      });

      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set headers for the file download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(file.filename)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      // Redirect to the Cloudinary file URL for direct download
      res.redirect(file.path);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Error downloading file" });
    }
  },
};
