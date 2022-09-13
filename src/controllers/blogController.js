const validator = require("../validator/validation");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

//==================== CREATE BLOG FUNCTION ==========================

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { authorId, title, body, category, isPublished } = data;

    if (!validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Body cannot be empty" });
    }
    if (!authorId || !validator.isValidId(authorId))
      return res
        .status(400)
        .send({ statut: false, msg: "Valid authorId is required" });

    let authorPresence = await authorModel.findById(authorId);
    if (!authorPresence)
      return res.status(404).send({
        status: false,
        msg: "Author is not present, given authorId is incorrect",
      });

    if (authorPresence._id.toString() != req.headers.authorId)
      return res.status(404).send({
        status: false,
        msg: "You cannot create blog using others authorId",
      });
     
    if (!title||title.trim().length==0)
      return res.status(400).send({ statut: false, msg: "Title is required" });

    if (!body)
      return res
        .status(400)
        .send({ statut: false, msg: "Body content is a mandatory part" });

    if (body.length < 50)
      return res.status(400).send({
        statut: false,
        msg: "body content is too short...add some more content",
      });

    if (!category || category.length == 0)
      return res.status(400).send({ statut: false, msg: "Category is must" });

    if (isPublished) {
      data["isPublishedAt"] = new Date();
    }

    let savedata = await blogModel.create(data);
    res.status(201).send({ status: true, msg:"Blog Create Succesfully", data: savedata });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

//==================== GET BLOG FUNCTION ==========================

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    // console.log(data);
    let { authorId } = data;

    if (authorId && !validator.isValidId(authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Not a valid authorId" });
    }

    let allElement = await blogModel.find({
      $and: [data, { isDeleted: false }, { isPublished: true }],
    });

    if (allElement.length == 0)
      return res
        .status(404)
        .send({ status: false, msg: "No data found for given user" });

    return res.status(200).send({ status: true,msg:"Required blog is given below" ,data: allElement });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//==================== UPDATE BLOG FUNCTION ==========================

const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params["blogId"];
    let { title, body, tags, subcategory } = data;

    if (!validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "You have not provided any data" });
    }

    if (body && body.length < 50) {
      return res.status(400).send({
        statut: false,
        msg: "body content is too short...add some more content",
      });
    }

    if (title && title.trim().length == 0) {
      return res
        .status(400)
        .send({ statut: false, msg: "Title is used but it is empty" });
    }


    if (title || body || tags || subcategory) {
      let updatedValues = await blogModel.findOneAndUpdate(
        { _id: blogId },
        {
          $push: {
            tags: tags,
            subcategory: subcategory,
          },
          $set: {
            title: title,
            body: body,
            updatedAt: new Date(),
            isPublished: true,
            publishedAt: new Date(),
          },
        },
        { new: true }
      );
      return res.status(200).send({ status: true, message: "Blog update is successfu",data: updatedValues });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

//====================== DELETE BLOG BY BLOGID ========================

const deletBlogById = async function (req, res) {
  try {
    let Id = req.params.blogId;
    let updatedata = await blogModel.findByIdAndUpdate(
      Id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    res.status(200).send({ status: true, data: updatedata });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//====================== DELETE BLOG by QURIES ========================

const deleteBlog = async function (req, res) {
  try {
    let data = req.query;
    let { isPublished } = data;

    data["isDeleted"] = false;

    if (isPublished && !["true", "false"].includes(isPublished)) {
      return res.status(400).send({
        status: false,
        message: `isPublished can accept value: "true" or "false"`,
      });
    }

    let deleteByQuery = await blogModel.updateMany(
      data,
      {
        $set: { isDeleted: true, deletedAt: new Date() },
      },
      { new: true }
    );

    if (deleteByQuery.modifiedCount == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "No blogs to delete with given queries" });
    } else {
      return res.status(200).send({
        status: true,
        msg: `${deleteByQuery.modifiedCount} Blogs deleted with given queries`,
      });
    }
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deletBlogById = deletBlogById;
module.exports.deleteBlog = deleteBlog;
