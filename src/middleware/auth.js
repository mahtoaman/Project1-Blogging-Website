const { query } = require("express");
const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const { isValidId, isValidB, isValidBodyody } = require("../validator/validation");

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
    //--------------------------validation for createBlog blog--------------------
    let bodyAuthotId = req.body.authorId;
    if (bodyAuthotId) {
      if (bodyAuthotId != decodedToken.authorId)
        return res.status(400).send({
          status: false,
          msg: "Provided authorId is not same as logined auhorId",
        });
      return next();
    }
    return next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=============================AUTHORIZATION ========================================
//=============================AUTHORIZATION ========================================
//=============================AUTHORIZATION ========================================

const isAuthorised = async function (req, res, next) {
  try {
    let blogId = req.params.blogId;

    //---------------------------------------------------------------
    //this one is authorization for delete blog by query.......
    let data = req.query;

    if (isValidBody(data)) {
      let decodedAuthorId = decodedToken.authorId;
      if (data.authorId != null) {
        if (!isValidId(data.authorId))
          return res
            .status(400)
            .send({ status: false, msg: "Invalid authorId" });

        if (data.authorId != decodedAuthorId)
          return res
            .status(400)
            .send({ status: false, msg: `You cannot delete other's data.` });
      }
      data["authorId"] = decodedAuthorId.toString();
      return next();
    }
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //autorization for deleteById and update API
    else if (blogId) {
      if (!isValidId(blogId))
        return res
          .status(400)
          .send({ status: false, message: "Invalid blogId" });

      let blog = await blogModel.findById(blogId);

      //edgeCase1 -- is auhtor present for given blogId
      if (!blog)
        return res
          .status(404)
          .send({ status: false, message: "No blog found with given blogId" });

      let authorId = blog.authorId.toString();

      if (authorId != decodedToken.authorId) {
        return res.status(403).send({
          status: false,
          message: "You are not authorized to perfom this operation",
        });
      }
      //if auhtorId from blog and authorId from decodedToken are same...then returning control to next function
      return next();
    } else {
      return res.status(403).send({
        status: false,
        message:
        "You cannot send empty request if you want to deleteById or want to update then please provide blogId in param or if you want to  deleteByQuery then please give some parameters in query param",
      });
    }
//----------------------------------------------------------------------------------------------------

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.isAuthenticate = isAuthenticate;
module.exports.isAuthorised = isAuthorised;
