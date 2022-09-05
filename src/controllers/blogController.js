const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");

const createBlog = async function (req, res) {
  try{
  let data = req.body;
  console.log(data.authorId)
  let authorPresence = await authorModel.findById(data.authorId);
   if (!authorPresence) return res.status(404).send({ status: false, msg: "author is not present" });

   let isValid = mongoose.Types.ObjectId.isValid(authorID);
   if (!isValid) return res.status(400).send({ status: false, message: "Invalid AuthoId" });

  let savedata = await blogModel.create(data);
  res.status(201).send({ msg: savedata, status: true });
}
catch (error) {
   res.status(400).send({ msg: error});
 }
}

module.exports.createBlog = createBlog