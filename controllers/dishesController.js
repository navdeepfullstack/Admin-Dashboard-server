const helper = require("../helpers/helper");
const Dishes = require("../models/Dishes");

module.exports = {
  addEditDish: async (req, res) => {
    try {
      if (req.body._id && req.body._id != "") {
        // let searchFilter = {
        //   name: { $regex: `^${req.body.name}$`, $options: "i" },
        //   _id: {
        //     $eq: req.body._id,
        //   },
        // };

        const findAny = await Dishes.findOne({_id:req.body._id});
console.log(findAny);
        if (findAny) {
          const updateRestro = await Dishes.findByIdAndUpdate(
            { _id: req.body._id },
            req.body,
            { new: true }
          );
          return helper.success(res, "Dishes updated successfully", {
            updateRestro,
          });
        }
      } else {
        const createDish = new Dishes(req.body);
        const saveDish = await createDish.save();
        return helper.success(res, "Dishes created successfully", { saveDish });
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  deleteMe: async (req, res) => {
    try {
      const findById = await Dishes.findByIdAndDelete(req.params._id);
      if (findById) {
        return helper.success(res, "Dishes deleted");
      } else {
        throw `This Dishes not exist`;
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  DishesList: async (req, res) => {
    const searchQuery = req.body.name;
    try {
      const allCount = await Dishes.estimatedDocumentCount();
      let page = +req.query.page && +req.query.page > 0 ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);

      if (!searchQuery) {
        const getAllDishes = await Dishes.find({
          restaurant_id: req.params._id,
        })
          .populate("restaurant_id")
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: getAllDishes,
        });
      } else {
        const getAllDishes = await Dishes.find({
          name: searchQuery,
        })
          .populate("restaurant_id")

          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: getAllDishes,
        });
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
};
