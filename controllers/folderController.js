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
      await prisma.folder.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: "Folder deleted successfully" }); // Send a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting folder");
    }
  },
};
