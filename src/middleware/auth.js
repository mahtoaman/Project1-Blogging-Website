const { query } = require("express");
const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const { isValidId, isValidBody } = require("../validator/validation");

//===============================AUTHENTICATION=============================

const isAuthenticate = async function (req, res, next) {
  try {
    token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "You're not logined, Your token is missing",
      });
    }
    decodedToken = jwt.verify(
      token,
      "authors-secret-key",
      (error, response) => {
        if (error) {
          return res
            .status(400)
            .send({ status: false, message: "Not a Valid Token" });
        }
        req.headers.authorId = response.authorId;
        next();
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//===================AUTHORIZATION FOR UPDATE AND DELETE BY ID ============================

const isAuthorised = async function (req, res, next) {
  try {
    blogId = req.params.blogId;

    if (!isValidId(blogId))
      return res
        .status(400)
        .send({ status: false, message: "Not a valid blogId" });

    let checkBlog = await blogModel.findOne({ _id: blogId, isDeleted: false });
    if (!checkBlog)
      return res
        .status(400)
        .send({ status: false, msg: "No blog found with  given blogId" });

    if (req.headers.authorId != checkBlog.authorId.toString()) {
      return res
        .status(400)
        .send({ status: false, msg: "You are not authorised" });
    }
    next();
  } catch {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=====================AUTHORIZATION FOR DELETE BY QUERY PARAMS==================================

const isAutForQuery = async function (req, res, next) {
  try {
    let data = req.query;
    let { authorId } = data;

    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "You cannot send empty request" });
    }

    if (
      authorId &&
      (!isValidId(authorId) || authorId != req.headers.authorId)
    ) {
      return res
        .status(403)
        .send({ status: false, msg: "You are not authorized person" });
    }

    data["authorId"] = req.headers.authorId;
    next();
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.isAuthenticate = isAuthenticate;
module.exports.isAuthorised = isAuthorised;
module.exports.isAutForQuery = isAutForQuery;
