const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,

        default: "",
      },
    ],
    is_featured: {
      type: Boolean,

      default: false,
    },
    price: {
      type: String,

      default: "",
    },
    colors: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,

        default: "",
      },
    ],
    category: {
      type: Schema.Types.ObjectId,

      ref: "categories",
    },
 
  },
  { timestamps: true }
);

module.exports = Product = mongoose.model("products", ProductSchema);
