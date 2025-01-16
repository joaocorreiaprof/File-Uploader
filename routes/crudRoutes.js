// routes/homeRoutes.js
const express = require("express");
const router = express.Router();
const crudController = require("../controllers/crudController");

router.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in"); // Redirect to login if the user is not authenticated
  }

  // Fetch user folders and render the page
  crudController.getUserFolders(req, res, (err, folders) => {
    if (err) {
      return res.status(500).send("Error fetching folders");
    }

    // Render the index page with the user and their folders
    res.render("index", { user: req.user, folders: folders });
  });
});
//Create user fodler
router.post("/create-folder", crudController.createUserFolder);

module.exports = router;
