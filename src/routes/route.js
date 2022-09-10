const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const { isAuthenticate, isAuthorised } = require("../middleware/auth");


router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

router.post("/authors", authorController.createAuthor);
router.post("/blogs", isAuthenticate,blogController.createBlog);

router.get("/Blog", isAuthenticate, blogController.getBlog);
// router.put("/blogs/:blogId",isAuthenticate, blogController.updateBlog); //UPDATE API
router.put("/blogs/:blogId",isAuthenticate, isAuthorised, blogController.updateBlog); //UPDATE API

router.delete("/blogs/:blogId",isAuthenticate,isAuthorised, blogController.deletBlogById);
router.delete("/blogs",isAuthenticate,isAuthorised, blogController.deleteBlog);

router.post("/login", authorController.loginAuthor)


module.exports = router;