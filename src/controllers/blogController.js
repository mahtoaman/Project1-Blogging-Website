const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

const createBlog = async function (req, res) {
  try{
  let data = req.body;
  console.log(data.authorId)
  let authorPresence = await authorModel.findById(data.authorId);
   if (!authorPresence) return res.status(404).send({ status: false, msg: "author is not present" });

  let savedata = await blogModel.create(data);
  res.send({ msg: savedata, status: true });
}
catch (error) {
   res.status(400).send({ msg: error.message });
 }
}

module.exports.createBlog = createBlog