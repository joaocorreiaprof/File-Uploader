const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController");

// Route for deleting a folder
router.delete("/delete-folder/:id", folderController.deleteFolder);

module.exports = router;
