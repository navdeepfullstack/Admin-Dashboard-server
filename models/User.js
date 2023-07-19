const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,

      default: "",
    },
    email: {
      type: String,

      default: "",
    },
    password: {
      type: String,

      default: "",
    },

    country: {
      type: String,

      default: "",
    },
    phone: {
      type: String,

      unqiue: true,
    },

    role: {
      type: Number,
      default: 1,
    },
    login_time: {
      type: String,

      default: "",
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("users", UserSchema);
