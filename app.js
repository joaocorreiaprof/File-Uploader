const express = require("express");
const app = express();

//Set up middleware for serving static files
app.use(express.static("public"));

//Routes
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

//Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
