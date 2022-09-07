const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");

const authenticate = async function (req, res, next) {
  try {
    token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Token is missing" });
    }
    decodedToken = jwt.verify(token, "authors-secret-key");
    if (!decodedToken) {
      return res
        .status(400)
        .send({ status: false, message: "Not a Valid Token" });
    }
    next();
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const autherization = async function (req, res, next) {
  console.log("inside authorization");
  try {
    let blogId = req.params.blogId;
    
    let author = await blogModel.findById(blogId);
    let authorId = author.authorId.toString();

    // console.log(authorId + "auhor from token");
    // console.log(decodedToken.authorId + "auhor from token");
    if (author) {
      if (authorId != decodedToken.authorId) {
        return res
          .status(403)
          .send({ status: false, message: "You are not a authorized user" });
      }
      console.log("sending control to next");
      return next();
    }
    return res
      .status(404)
      .send({ status: false, message: "author not found with given blogId" });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.authenticate = authenticate;
module.exports.autherization = autherization;
