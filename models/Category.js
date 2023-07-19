const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
  category_name: {
      type: String,
      required: true
  },
  image: {
      type: String,
      required: true
  },
  status: {
      type: Boolean,
      required: true,
      default: true
  }
},
  { timestamps: true }
);

module.exports = Category = mongoose.model("categories", CategorySchema);
