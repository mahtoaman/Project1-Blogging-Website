const authorModel = require("../models/authorModel");
const validator = require("../validator/validation");
const jwt =require('jsonwebtoken')

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

    //edgeCase 4 -- is title valid
    if (!title)
      return res
        .status(400)
        .send({ status: false, msg: "You're missing title :)" });

    //edgeCase 4.1 --is title acc
    if (title != "Mr" && title != "Mrs" && title != "Miss")
      return res
        .status(400)
        .send({
          status: false,
          msg: `Title can contain only "Mr","Mrs" or "Miss`,
        });

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
//edgeCase7 --checking password or valid or not
    if (!validator.isValidPassword(password))
      return res.status(400).send({
        status: false,
        msg: "Password must contain minimum eight characters, at least one upperCase nad lowerCase letter, one number and one special character:",
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


//AUTHENTICATION 

const loginAuthor = async function (req, res) {
  try {
    let emailId = req.body.email;
    let password = req.body.password;

    if (!validator.isValidEmail(emailId)) {
      return res.status(400).send({ status: false, msg: "Email is Invalid" });
    }
    if (!emailId) {
      return res
        .status(400)
        .send({ status: false, msg: "Email Id is required" });
    }

    if (!password) {
      return res.status(400).send({ status: false, msg: "Password is must" });
    }

    let author = await authorModel.findOne({
      email: emailId,
      password: password,
    });
    console.log(author);
    if (!author) {
      return res.status(404).send({ status: false, msg: "Author not found" });
    }

    let createToken = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "plutonium",
        organisation: "FunctionUp",
      },
      "authors-secret-key"
    );
    res.status(201).send({ status: true, msg: createToken });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.loginAuthor = loginAuthor;
module.exports.createAuthor = createAuthor;
