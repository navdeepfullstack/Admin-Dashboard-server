const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VendorSchema = new Schema(
  {
   vendor_name: {
      type: String,

      default: "",
    },
    image: {
      type: String,

      default: "",
    },
  
  },
  { timestamps: true }
);

module.exports = Vendor = mongoose.model("vendors", VendorSchema);
