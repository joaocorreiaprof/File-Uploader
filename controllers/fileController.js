const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../cloudinary");
const axios = require("axios");
const path = require("path");

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

      const filePath = file.path; // Cloudinary file URL
      const fileExtension = path.extname(file.filename).toLowerCase();

      // If the file is hosted on Cloudinary, fetch and send it as a stream
      if (filePath.startsWith("http")) {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${encodeURIComponent(file.filename)}"`
        );

        // Determine the content type based on the file extension
        let contentType = "application/octet-stream"; // Default type for unknown files
        if ([".jpg", ".jpeg", ".png", ".gif", ".bmp"].includes(fileExtension)) {
          contentType = "image/jpeg"; // or "image/png", etc., based on file type
        } else if ([".pdf"].includes(fileExtension)) {
          contentType = "application/pdf";
        } else if ([".txt", ".csv"].includes(fileExtension)) {
          contentType = "text/plain";
        }

        res.setHeader("Content-Type", contentType);

        // Fetch the file from Cloudinary with axios
        const cloudinaryResponse = await axios.get(filePath, {
          responseType: "arraybuffer",
        });

        // Send the file data directly as a buffer
        res.send(Buffer.from(cloudinaryResponse.data));
      } else {
        // If the file is local, use res.download() to serve the file
        res.download(filePath, file.filename, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Error downloading file");
          }
        });
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ error: "Error downloading file" });
    }
  },
};
