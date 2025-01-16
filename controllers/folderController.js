// folderController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  deleteFolder: async (req, res) => {
    const { id } = req.params;

    try {
      console.log(`Deleting folder with ID: ${id}`);
      await prisma.folder.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).send("Folder deleted");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error deleting folder");
    }
  },
};
