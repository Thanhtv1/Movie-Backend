const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      required: true,
      default: "https://cdn-icons-png.flaticon.com/512/5460/5460864.png",
      type: String,
    },
    favMovies: Array,
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
