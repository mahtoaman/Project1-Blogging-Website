const { default: mongoose } = require("mongoose");

//E-Mail validator

const isValidEmail = function (mail) {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
};

// let data = {"name":5}
const isValidBody = function (data) {
  return Object.keys(data).length > 0;
};

// console.log(isValidBody(data))

const isValidId = function (data) {
  return mongoose.Types.ObjectId.isValid(data);
};

module.exports = { isValidEmail, isValidBody, isValidId };

//first name validation

//
