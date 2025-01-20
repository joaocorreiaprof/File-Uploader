const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController");
const upload = require("../multer");

// Route for editing a folder
router.put("/edit-folder/:id", folderController.editFolder);

// Route for deleting a folder
router.delete("/delete-folder/:id", folderController.deleteFolder);

// Enter folder page
router.get("/folder/:id", folderController.folderPage);

// Route for uploading a file to a folder
router.post("/folder/:id/upload", upload, folderController.uploadFileToFolder);

module.exports = router;
