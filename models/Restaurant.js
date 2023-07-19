const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    openTime: {
      type: String,
    },
    closeTime: {
      type: String,
    },
    
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Restaurant = mongoose.model("restaurants", RestaurantSchema);
 
