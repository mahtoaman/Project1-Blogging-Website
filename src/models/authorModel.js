const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      //   required: true,
    },
    fname: {
      type: String,
      //   required: true,
    },
    lname: {
      type: String,
      //   required: true,
    },
    email: {
      type: String,
      //   required: true,
      //unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      //   required: true,
    },
  }
  //   { timestamps: true }
);

module.exports = mongoose.model("author", authorSchema);
