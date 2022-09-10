const validator = require("../validator/validation");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

//==================== CREATE BLOG FUNCTION ==========================

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { authorId, title, body, category, isPublished } = data;

    //checking that body is empty or not
    if (!validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Body cannot be empty" });
    }
    if (!authorId)
      //edgeCase1 - checks if authorId is provided in body or not (authorCase1)
      return res
        .status(400)
        .send({ statut: false, msg: "AuthorId is required" });

    //edgeCase3 - (authorCase3) if authorId is correct then, is there any author present with given id or not
    let authorPresence = await authorModel.findById(authorId);
    if (!authorPresence)
      return res.status(404).send({
        status: false,
        msg: "Author is not present, given authorId is incorrect",
      });

    //edgeCase4 - is title present or not
    if (!title.trim().length)
      return res.status(400).send({ statut: false, msg: "Title is required" });

    //edgeCase5 - is body data present or not
    if (!body)
      return res
        .status(400)
        .send({ statut: false, msg: "Body content is a mandatory part" });

    //content should be more than 100 characters
    if (body.length < 50)
      return res.status(400).send({
        statut: false,
        msg: "body content is too short...add some more content",
      });

    //edgeCase5 - is body data present or not
    if (!category || category.length == 0)
      return res.status(400).send({ statut: false, msg: "Category is must" });

    //adding the key Created at to the data, so that we can log this data in collection
    // data["createdAt"] = new Date();
    let savedata = await blogModel.create(data);
    if (isPublished) {
      let updateDate = await blogModel.findOneAndUpdate(
        data,
        { $set: { publishedAt: new Date() } },
        { new: true }
      );
      return res.status(201).send({ msg: updateDate, status: true });
    }
    res.status(201).send({ msg: savedata, status: true });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

//==================== GET BLOG FUNCTION ==========================

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    let { authorId } = data;

    //edgeCase -- if authorId is given then is it valid or not
    if (authorId) {
      if (!validator.isValidId(authorId))
        return res
          .status(400)
          .send({ status: false, msg: "Not a valid authorId" });
    }
    //is there any document present for the given details???
    let allElement = await blogModel.find({
      $and: [data, { isDeleted: false }, { isPublished: true }],
    });

    if (allElement.length == 0)
      return res
        .status(404)
        .send({ status: false, msg: "No data found for given user" });

    return res.status(200).send({ status: true, msg: allElement });
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

    if (!validator.isValidBody(data))
      return res
        .status(400)
        .send({ status: false, msg: "You have not provided any data" });

    ///edgeCase 3 ...body content should be greater than 50
    if (body) {
      if (body.length < 50)
        return res.status(400).send({
          statut: false,
          msg: "body content is too short...add some more content",
        });
    }

    //edgeCase 4 -- if title is present than it should not be empty
    if (title != null) {
      if (title.trim(0.0).length == 0)
        return res
          .status(400)
          .send({ statut: false, msg: "Title is is used but it is empty" });
    }

    //updating the blogs with given data
    //this line will update according to data provided in the request boddy
    //if data is not provided then it will not update that value
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
      res.status(200).send({ status: true, data: updatedValues });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//====================== DELETE BLOG BY BLOGID ========================

const deletBlogById = async function (req, res) {
  try {
    let Id = req.params.blogId;

    //edgeCase1 -- is valid blodId
    if (!validator.isValidId(Id))
      return res.status(400).send({ status: false, msg: "Invalid blogId" });

    //is blog present with given blogId
    let check = await blogModel.findById(Id);
    if (!check)
      return res.status(404).send({
        status: false,
        msg: "No blog found with given blogId to delete blogs",
      });

    // is it already deleted??
    if (check.isDeleted)
      return res.status(404).send({
        status: false,
        msg: "Blog not found may you have already delted :)",
      });

    let updatedata = await blogModel.findByIdAndUpdate(
      Id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    res
      .status(200)
      .send({ status: "Below document is deleted", data: updatedata });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//====================== DELETE BLOG by QURIES ========================

const deleteBlog = async function (req, res) {
  try {
    let data = req.query;
    let {isPublished} = data
    
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
