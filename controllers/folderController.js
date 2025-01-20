const cloudinary = require("../cloudinary");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      // Delete all files associated with the folder
      await prisma.file.deleteMany({
        where: { folderId: parseInt(id) },
      });

      // Delete the folder
      await prisma.folder.delete({
        where: { id: parseInt(id) },
      });

      res
        .status(200)
        .json({ message: "Folder and its files deleted successfully" });
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

    // Check if the file is uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    try {
      const folderData = await prisma.folder.findUnique({
        where: { id: parseInt(folderId) },
      });

      if (!folderData) {
        return res.status(404).send("Folder not found");
      }

      // Handle file upload using Cloudinary
      const uploadFile = (file, folderName) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            file.path,
            { folder: folderName },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });
      };

      const cloudinaryResult = await uploadFile(req.file, folderData.name);

      // Save file metadata in the database
      await prisma.file.create({
        data: {
          filename: cloudinaryResult.original_filename,
          path: cloudinaryResult.secure_url,
          cloudinary_url: cloudinaryResult.secure_url,
          cloudinary_public_id: cloudinaryResult.public_id,
          folderId: parseInt(folderId),
        },
      });

      res.redirect(`/folder/${folderId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error uploading file to Cloudinary");
    }
  },
};
