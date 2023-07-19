const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DishesSchema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "restaurants",
    },
    name: {
      type: String,
       
    },
    des: {
      type: String,
    },
    price: {
      type: Number,
      default:0.0
    },
    status: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "veg",
    },
  },
  { timestamps: true }
);

const Dishes = mongoose.model("dishes", DishesSchema);
module.exports = Dishes;
