const crudController = require("../controllers/crudController");

module.exports = {
  getHomePage: (req, res) => {
    if (!req.user) {
      return res.redirect("/log-in");
    }

    // Fetch user folders and render the page
    crudController.getUserFolders(req, res, (err, folders) => {
      if (err) {
        return res.status(500).send("Error fetching folders");
      }

      res.render("index", { user: req.user, folders: folders });
    });
  },
};
