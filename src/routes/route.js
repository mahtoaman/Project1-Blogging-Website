const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const { authenticate, autherization } = require("../middleware/auth");


router.get("/test-me", function (req, res) {
  res.send("My first ever api!");
});

router.post("/authors", authorController.createAuthor);
router.post("/blogs", authenticate,blogController.createBlog);

router.get("/filterBlog", authenticate,blogController.getBlog);
router.put("/blogs/:blogId",authenticate, autherization,blogController.updateBlog);

router.delete("/blogs/:blogId",authenticate, autherization, blogController.deletBlogById);
router.delete("/blogs",authenticate, blogController.deleteBlog);

router.post("/login", authorController.loginAuthor)


module.exports = router;