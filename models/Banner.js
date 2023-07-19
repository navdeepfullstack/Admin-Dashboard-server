const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BannerSchema = new Schema({
 
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

module.exports = Banner = mongoose.model("banners", BannerSchema);
