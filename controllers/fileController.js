const multer = require("multer");
const path = require("path");

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../files");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).single("file");

// Controller function to handle file upload
const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send("Error uploading file");
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    res.redirect("/");
  });
};

module.exports = {
  uploadFile,
};
