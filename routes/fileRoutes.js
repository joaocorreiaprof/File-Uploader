const express = require("express");
const fileController = require("../controllers/fileController");
const router = express.Router();

router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/upload", fileController.uploadFile);

module.exports = router;
