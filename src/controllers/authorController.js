const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const {
  isValidBody,
  isValidEmail,
  isValidName,
  isValidPassword,
} = require("../validator/validation");

const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    let { fname, lname, title, email, password } = data;

    if (!isValidBody(data))
      return res
        .status(400)
        .send({ status: false, msg: "Request body cannot be empty" });

    if (!fname || !isValidName(fname))
      return res.status(400).send({
        status: false,
        msg: "First name is required in a valid format",
      });

    if (!lname || !isValidName(lname))
      return res.status(400).send({
        status: false,
        msg: "Last name is required in a valid format",
      });

    if (!title || (title != "Mr" && title != "Mrs" && title != "Miss"))
      return res.status(400).send({
        status: false,
        msg: `Title is required in given format, format: "Mr","Mrs" or "Miss`,
      });

    if (!email || !isValidEmail(email.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "email is required in a valid format" });
    }

    let inputEmail = await authorModel.findOne({ email: email });
    if (inputEmail)
      return res
        .status(400)
        .send({ status: false, msg: "Provided email is already registered" });

    if (!password || !isValidPassword(password))
      return res.status(400).send({
        status: false,
        msg: "Password is required with these conditions: at least one upperCase, lowerCase letter, one number and one special character",
      });

    let savedata = await authorModel.create(data);
    res.status(201).send({
      status: false,
      createdData: savedata,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//========================================== LOGIN USER ================================================================

const loginAuthor = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !isValidEmail(email.trim())) {
      return res
        .status(400)
        .send({ status: false, msg: "email is required in a valid format" });
    }
    if (!password || !isValidPassword(password))
      return res.status(400).send({
        status: false,
        msg: "Password is required with these conditions: at least one upperCase, lowerCase letter, one number and one special character",
      });

    let checkData = await authorModel.findOne({ email: email });
    if (!checkData)
      return res.status(400).send({
        status: false,
        msg: "You're not registered, registered first.",
      });

    if (password != checkData.password)
      return res.status(404).send({
        status: false,
        msg: "Incorrect password",
      });

    let createToken = jwt.sign(
      {
        authorId: checkData._id.toString(),
        batch: "plutonium",
        organisation: "FunctionUp",
      },
      "authors-secret-key"
    );
    return res
      .status(201)
      .send({ status: true, msg: createToken });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.loginAuthor = loginAuthor;
module.exports.createAuthor = createAuthor;
