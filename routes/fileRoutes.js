const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("file"), fileController.uploadFile);

// Route for deleting a file
router.delete("/delete-file/:id", fileController.deleteFile);

//Editing file
router.put("/edit-file/:id", fileController.editFile);

// New route for downloading a file
router.get("/download-file/:id", fileController.downloadFile);

module.exports = router;
