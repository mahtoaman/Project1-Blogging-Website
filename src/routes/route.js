
const express = require("express");
const router = express.Router();
 const controller=require('../controllers/authorController')

router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

router.post("/authors",controller.createAuthor);

module.exports = router;