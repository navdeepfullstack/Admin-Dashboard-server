const helper = require("../helpers/helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Category = require("../models/Category");

const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/Product");
require("dotenv").config();
module.exports = {
  dashboard: async (req, res) => {
    try {
      const userCountPromise = User.estimatedDocumentCount();
      const categoriesCountPromise = Category.estimatedDocumentCount();
      const productsCountPromise = Product.estimatedDocumentCount();
      const vendorsCountPromise = Category.estimatedDocumentCount();

      const [userCount, categoriesCount, productsCount, vendorsCount] =
        await Promise.all([userCountPromise, categoriesCountPromise, productsCountPromise, vendorsCountPromise]);

      return helper.success(res, "Data", [
        {
          name: "User",
          number: userCount,
        },
        {
          name: "Category",

          number: categoriesCount,
        },
        {
          name: "Products",

          number: productsCount,
        },
        {
          name: "Vendors",

          number: vendorsCount,
        },
      ]);
    } catch (err) {
      return helper.error(res, err);
    }
  },
  uploadImage: async (req, res) => {
    try {
      if (!req.files || !req.files.image) throw "Image is required";
      if (!req.body.folder) throw "Folder is required";
      let folder = req.body.folder;
      let image = req.files.image;
      let filename = uuidv4() + "." + image.mimetype.split("/")[1];
      let imagepath = path.join(
        __dirname,
        `../public/uploads/${folder}/${filename}`
      );
      console.log(imagepath);
      await image.mv(imagepath, (err) => {
        if (err) {
          return helper.error(res, "Incorrect Path");
        }
        return helper.success(res, "Image Uploaded", {
          filename: filename,
        });
      });
    } catch (err) {
      console.log(err);
      return helper.error(res, err);
    }
  },

  uploadMultipleImages: async (req, res) => {
    try {
      if (!req.files || !req.files.images) {
        throw "Images are required";
      }

      if (!req.body.folder) {
        throw "Folder is required";
      }

      const folder = req.body.folder;
      const images = req.files.images;

      const uploadedImages = [];

      // Process each image
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const filename = uuidv4() + "." + image.mimetype.split("/")[1];
        console.log("filename",filename);
        const imagepath = path.join(
          __dirname,
          `../public/uploads/${folder}/${filename}`
        );
        uploadedImages.push(filename);

        await image.mv(imagepath, (err) => {
          if (err) {
            throw "Error occurred while uploading images";
          } 
        });
      }

      return helper.success(res, "Images Uploaded", {
        filenames: uploadedImages,
      });
    } catch (err) {
      console.log(err);
      return helper.error(res, err);
    }
  },

  login: async (req, res) => {
    try {
      try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: 0 });

        if (!user) {
          throw "User not found";
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw "Incorrect password";
        }

        const login_time = helper.unixTimestamp();

        await User.updateOne({ _id: user._id }, { login_time });

        const payload = {
          id: user._id,
          login_time,
        };

        const token = await jwt.sign(payload, process.env.SECRET_OR_KEY);

        return helper.success(res, "User logged in successfully", {
          token: "Bearer " + token,
          user: user,
        });
      } catch (error) {
        return helper.error(res, error);
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  // signup: async (req, res) => {
  //   try {
  //     const { email, username, password, dob, country, gender, phone } =
  //       req.body;

  //     let user = await User.findOne({ email });

  //     if (user) {
  //       throw "User already exists";
  //     }

  //     user = await User.findOne({ phone });

  //     if (user) {
  //       throw "Phone number already exists";
  //     }

  //     let login_time = helper.unixTimestamp();

  //     let salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT_HASH_ROUNDS);
  //     let hashPassword = await bcrypt.hash(password, salt);

  //     let createUser = await User.create({
  //       ...req.body,
  //       login_time,
  //       password: hashPassword,
  //     });

  //     return helper.success(res, "Admin registered successfully", {
  //       user: createUser,
  //     });
  //   } catch (error) {
  //     return helper.error(res, error);
  //   }
  // },
};
