const helper = require("../helpers/helper");
const Restaurant = require("../models/Restaurant");

module.exports = {
  addEditRestro: async (req, res) => {
    try {
      if (req.body._id && req.body._id != "") {
        const findAny = await Restaurant.findById(req.body._id);
        if (findAny) {
          const updateRestro = await Restaurant.updateOne(
            { _id: req.body._id },
            req.body
          );
          return helper.success(res, "Restaurant updated successfully", {});
        }
      } else {
        const createRestro = await Restaurant.create(req.body);
        return helper.success(res, "Restaurant created successfully");
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  deleteRestro: async (req, res) => {
    try {
      const findById = await Restaurant.findByIdAndDelete(req.params._id);
      if (findById) {
        return helper.success(res, "Restaurant deleted");
      } else {
        throw `This Restaurant not exist`;
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  restaurantList: async (req, res) => {
    const searchQuery = req.body.name;
    try {
      const allCount = await Restaurant.estimatedDocumentCount();
      let page = +req.query.page && +req.query.page > 0 ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);

      if (!searchQuery) {
        const restaurantWithMenu= await Restaurant.aggregate([
        {
          $lookup:{
            from: "dishes",
            localField: "_id",
            foreignField: "restaurant_id",
            as: "menu",
          }
        }
        ])
        const getAllRestaurant = await Restaurant.find()
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: restaurantWithMenu,
        });
      } else {
        const getAllRestaurant = await Restaurant.find({
          name: searchQuery,
        })
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: getAllRestaurant,
        });
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
};
