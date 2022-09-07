const validator = require("../validator/validation");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

//==================== CREATE BLOG FUNCTION (aman)==========================

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let published = data.isPublished;
    console.log(data.authorId);
    if (!validator.isValidId(data.authorId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid AuthoId" });

    let authorPresence = await authorModel.findById(data.authorId);
    if (!authorPresence)
      return res
        .status(404)
        .send({ status: false, msg: "author is not present" });
    let savedata = await blogModel.create(data);
    if (published) {
      let updateDate = await blogModel.findOneAndUpdate(
        data,
        { $set: { publishedAt: new Date() } },
        { new: true }
      );
      return res.status(201).send({ msg: updateDate, status: true });
    }
    res.status(201).send({ msg: savedata, status: true });
  } catch (error) {
    res.status(400).send({ msg: error });
  }
};

//==================== GET BLOG FUNCTION (upendra) ==========================

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    if (!validator.isValidId(data.authorId)) return res.status(400).send({ status: false, msg:"Invalid authorId"});

    let allelement = await blogModel.find({
      $and: [data, { isDeleted: false }, { isPublished: true }],
    });

    if (allelement.length==0) return res.status(404).send({ status: false, msg: "Data not found" });
      
  return res.status(200).send({ status: true, msg: allelement });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//==================== UPDATE BLOG FUNCTION (aman)==========================

const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    // console.log(data);
    let blogId = req.params["blogId"];
    // console.log(blogId);
    let { title, body, tags, subCategory } = data;

    if (!validator.isValidId(blogId))
      return res
        .status(400)
        .send({ status: false, message: "Not a valid blogId" });

    let checkBlog = await blogModel.findOne({ _id: blogId });
    if (!checkBlog)
      return res
        .status(400)
        .send({ status: false, msg: "No blog found with given Id" });

    let emptyBody = validator.isValidBody(data);
    if (!emptyBody)
      return res
        .status(400)
        .send({ status: false, msg: "You have not provided any data" });

    if (title || body || tags || subCategory) {
      let updatedValues = await blogModel.findOneAndUpdate(
        { _id: blogId },
        {
          $set: {
            title: title,
            body: body,
            tags: tags,
            subcategory: subCategory,
            isPublished:true,
            publishedAt:new Date()
          },
        },
        //this line will update according to data provided in the request boddy if data is not provided then it will not update that value
        { new: true }
      );
      res.status(200).send({ status: true, data: updatedValues });
    }
  } catch (err) {
    res.status(400).send({ status: false, msg: err.message });
  }
};

//====================== DELETE BLOG BY BLOGID (saurav)========================

const deletBlogById = async function (req, res) {
  try {
    let Id = req.params.blogId;

    if (!validator.isValidId(Id))
      return res.status(400).send({ status: false, msg: "Invalid blogId" });

    let check = await blogModel.findById(Id);
    if (!check) return res.status(404).send({ status: false, msg: "No blog found with given blogId" });

    if (check.isDeleted) return res.status(404).send({ status: false, msg: "Blog not found" });

    let updatedata = await blogModel.findByIdAndUpdate(
      Id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    res.status(200).send({ status: true , data: updatedata});
  } catch (error) {
    res.status(500).send({status: false , msg: error.message });
  }
};

//====================== DELETE BLOG (DEV)========================

const deleteBlog = async function (req, res) {
  try {
    let data = req.query;

    if(validator.isValidQuery(data)){
       data['isDeleted'] = false
    }
    else{
      return res.status(400).send({ status: false, msg: "Please enter at least one query to delete the blog" });
    }
    if(data.authorId){
    if (!validator.isValidId(data.authorId))
      return res.status(400).send({ status: false, msg: "Invalid authorId" })};

    let deleteByQuery = await blogModel.updateMany(data, {
      $set: { isDeleted: true, deletedAt: new Date()},},{new:true});

    if (deleteByQuery.modifiedCount == 0) {
      return res.status(404).send({status:false, msg: "No blogs to delete with given queries" });
    } 
    else {
      return res.status(200).send({status:true, msg: `${deleteByQuery.modifiedCount} Blogs deleted with given queries` });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

module.exports.createBlog = createBlog;       //aman
module.exports.getBlog = getBlog;             //upendra
module.exports.updateBlog = updateBlog;       //AMAN
module.exports.deletBlogById = deletBlogById; //saurav
module.exports.deleteBlog = deleteBlog;       //dev
