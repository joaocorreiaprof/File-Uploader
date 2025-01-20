const express = require("express");
const fileController = require("../controllers/fileController");
const router = express.Router();

// Route for deleting a file
router.delete("/delete-file/:id", fileController.deleteFile);

// Route for editing a file
router.put("/edit-file/:id", fileController.editFile);

// Route for downloading a file
router.get("/download-file/:id", fileController.downloadFile);

module.exports = router;
