const { default: mongoose } = require("mongoose");

const isValidEmail = function (mail) {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
};

const isValidPassword = function (pass) {
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/.test(pass)) return true;
  return false
};

const isValidName = function(name){
  if (/^[A-Za-z]{1,35}/.test(name)) return true
  return false
}

const isValidBody = function (data) {
  return Object.keys(data).length > 0;
}
;

const isValidId = function (data) {
  return mongoose.Types.ObjectId.isValid(data);
};

module.exports = { isValidEmail,isValidName, isValidBody, isValidPassword, isValidId};

