const mongoose = require("mongoose");

let validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return re.test(email)
};

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("author", authorSchema);

//{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }

// email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate: [validateEmail, 'Please fill a valid email address'],
//         match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
//     }