const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const { isValidId } = require("../validator/validation");

const isAuthenticate = async function (req, res, next) {
  try {
    token = req.headers["x-api-key"];

    //edgeCase1 -- is token present or not
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "You're not logined, Your token is missing",
      });
    }
    //if token is present then decoding the token
    decodedToken = jwt.verify(token, "authors-secret-key");
    if (!decodedToken) {
      return res
        .status(400)
        .send({ status: false, message: "Not a Valid Token" });
    }

    //======validation for creating blog===========================================
    let bodyAuthotId = req.body.authorId;
    if (bodyAuthotId) {
      if (bodyAuthotId != decodedToken.authorId)
        return res.status(400).send({
          status: false,
          message: "provided authorId is not same as logined auhorId",
        });
      //===========================================================================
      return next();
    }
    return next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const isAuthorised = async function (req, res, next) {
  try {
    let blogId = req.params.blogId;

    if (!isValidId(blogId))
      return res.status(400).send({ status: false, message: "Invalid blogId" });

    let blog = await blogModel.findById(blogId);

    //edgeCase1 -- is auhtor present for given blogId
    if (!blog)
      return res
        .status(404)
        .send({ status: false, message: "No blog found with given blogId" });

    let authorId = blog.authorId.toString();
    // console.log(authorId)
    // console.log(decodedToken.authorId)

    //veryfing authorization
    if (authorId != decodedToken.authorId) {
      return res.status(403).send({
        status: false,
        message: "You are not a authorized to perfom this operation",
      });
    }
    //if auhtorId from blog and authorId from decodedToken are same...then returning control to next function
    return next();
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.isAuthenticate = isAuthenticate;
module.exports.isAuthorised = isAuthorised;
