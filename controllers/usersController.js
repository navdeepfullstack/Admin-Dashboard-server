const helper = require("../helpers/helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
module.exports = {
  userList: async (req, res) => {
    try {
      let allCount = await User.estimatedDocumentCount();
      let page = req.query.page ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);

      let findData = await User.find({
        role: "1",
      })
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });

      return helper.success(res, "Data fetched successfully", {
        count: allCount,
        data: findData,
      });
    } catch (err) {
      console.log(err);
      return helper.error(res, err);
    }
  },

  addUser: async (req, res) => {
    try {
      const { email, password, country, phone, name } = req.body;

      if (!email.trim() || !phone.trim()) {
        throw "Email and phone fields can't be empty";
      }

      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

      if (existingUser) {
        throw "User with the provided email or phone already exists";
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: hashedPassword,
        country,
        phone,
        name,
      });

      const savedUser = await newUser.save();
      return res.json({ message: "User added successfully", user: savedUser });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  editUser: async (req, res) => {
    try {
      const { _id, email, phone } = req.body;
  
      if (!email.trim()) {
        throw "Email field can't be empty";
      }
  
      const existingUser = await User.findOne({ _id, email });
  
      if (!existingUser) {
        throw "User does not exist";
      }
  
      // if (existingUser.phone === phone) {
      //   throw "Your phone number already exists";
      // }
  
      const updateUser = await User.findByIdAndUpdate(
        _id,
        { ...req.body },
        { new: true }
      );
  
      return helper.success(res, "User updated successfully", { user: updateUser });
    } catch (error) {
      return helper.error(res, error);
    }
  },
  

  deleteUser: async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const findUser = await User.findById(user_id);
      if (findUser) {
        await User.findByIdAndDelete(user_id);
        return helper.success(res, "User deleted successfully", {});
      } else {
        throw `User not exist`;
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
};
