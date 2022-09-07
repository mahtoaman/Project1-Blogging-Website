const { default: mongoose } = require("mongoose");

//E-Mail validator

const isValidEmail = function (mail) {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
};

const isValidPassword = function (pass) {
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/.test(pass)) return true;
  return false
};
let pass = 'AMANa@1231'
console.log(isValidPassword(pass))

//name validation
const isValidName = function(name){
  if (/^[A-Za-z]{3,15}/.test(name)) return true
  return false
}
// let name = 'aman'
// console.log(isValidName(name))


// let data = {"name":5}
const isValidBody = function (data) {
  return Object.keys(data).length > 0;
}
;
const isValidQuery = function (data) {
  return Object.keys(data).length > 0;
};

// console.log(isValidBody(data))

const isValidId = function (data) {
  return mongoose.Types.ObjectId.isValid(data);
};

module.exports = { isValidEmail,isValidName, isValidBody, isValidPassword, isValidId, isValidQuery};

