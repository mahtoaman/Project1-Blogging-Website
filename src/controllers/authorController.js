const authorModel = require("../models/authorModel");
const validator = require("../validator/validation");

const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    let { fname, lname, title, email, password } = data;

    //edgeCase 1 --is requestBody empty
    let isEmptyBody = validator.isValidBody(data);
    if (!isEmptyBody)
      return res
        .status(400)
        .send({ status: false, msg: "Request body cannot be empty" });

    //edgeCase 2 -- is firstName provided or not
    if (!fname)
      return res
        .status(400)
        .send({ status: false, msg: "First name is required" });

    if (fname) {
      let verifyName = validator.isValidName(fname);
      if (!verifyName)
        return res.status(400).send({
          status: false,
          msg: "First name is not valid",
        });
    }

    //edgeCase 3 -- is lastName provided or not
    if (!lname)
      return res
        .status(400)
        .send({ status: false, msg: "Last name is required" });

    if (lname) {
      let verifyName = validator.isValidName(lname);
      if (!verifyName)
        return res.status(400).send({
          status: false,
          msg: "Last name is not valid",
        });
    }

    //edgeCase 4 -- is first name valid
    if (!title)
      return res
        .status(400)
        .send({ status: false, msg: "You're missing title :)" });

    // console.log('34')
    //edgeCase 5 --is e-mail id present and valid
    if (!email) {
      return res
        .status(400)
        .send({ status: false, msg: "Hey! You're missing email id :)" });
    }
    if (email) {
      let verifyEmail = validator.isValidEmail(email.trim());
      if (!verifyEmail)
        return res.status(400).send({
          status: false,
          msg: "This is not a valid syntax for email id, plsease try again",
        });
    }
    //edgeCase 5.1 -- is email already registered or not
    let inputEmail = await authorModel.findOne({ email });
    if (inputEmail != null)
      if (email == inputEmail.email)
        return res
          .status(400)
          .send({ status: false, msg: "Provided email is already registered" });

    // edgeCase 6 -- checking validation of password
    console.log(validator.isValidPassword(password));
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });

    if (!validator.isValidPassword(password))
      return res.status(400).send({
        status: false,
        msg: "Password must contain minimum eight characters, at least one letter, one number and one special character:",
      });

    let savedata = await authorModel.create(data);
    res.status(201).send({
      status: "Congratulations, your data is created",
      createdData: savedata,
    });
  } catch (error) {
    res.status(400).send({ status: false, message: error.message });
  }
};

module.exports.createAuthor = createAuthor;
