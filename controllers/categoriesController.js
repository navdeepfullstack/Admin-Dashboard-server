const helper = require("../helpers/helper");
const Category = require("../models/Category");
const path = require('path')
const fs = require("fs");
module.exports={
  addEditCategory: async (req, res) => {
    try {
      if (req.body._id && req.body._id != "") {
        // await validateInput(req.body, {
        //   name: "required",
        //   image: "required",
        // });
        let searchFilter = {
          category_name: { $regex: `^${req.body.category_name}$`, $options: "i" },
          _id: {
            $ne: req.body._id,
          },
        };

        let findAny = await Category.findOne(searchFilter);

        if (findAny) {
          if (req.body.is_image_uploaded == 1) {
            await fs.unlinkSync(
              path.join(
                __dirname,
                "../../public/uploads/categories/",
                req.body.image
              )
            );
          }
          throw "Name already in use";
        }
        delete req.body.is_image_uploaded;

        await Category.updateOne({ _id: req.body._id }, req.body);
        return helper.success(res, "Category updated successfully", {});
      } else {
        delete req.body._id;
        // await validateInput(req.body, {
        //   name: "required",
        //   image: "required",
        // });

        let searchFilter = {
          category_name: { $regex: `^${req.body.category_name}$`, $options: "i" },
        };

        let findAny = await Category.findOne(searchFilter);

        if (findAny) {
          if (req.body.is_image_uploaded == 1) {
            await fs.unlinkSync(
              path.join(
                __dirname,
                "../public/uploads/category/",
                req.body.image
              )
            );
          }
          throw "Name already in use";
        }
        delete req.body.is_image_uploaded;

        await Category.create(req.body);
        return helper.success(res, "Category created successfully", {});
      }
    } catch (err) {
      console.log(err);
      return helper.error(res, err);
    }
  },
  categoryList:async(req,res)=>{
    const searchQuery = req.body.category_name;
    try {
      let allCount = await Category.estimatedDocumentCount();
      let page = +req.query.page && +req.query.page > 0 ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);
      if (!searchQuery) {
        let findData = await Category.find()
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        // let allData = await Category.find()
        // .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: findData,
          // all:allData
        });
      } else {
        let findData = await Category.find({ category_name: searchQuery })
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });

        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: findData,
        });
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },

  deleteCategory:async(req,res)=>{
    try {
      const category_id = req.params.category_id;
      const deletedcategory = await Category.findByIdAndDelete(category_id);

      if (deletedcategory) {
        return helper.success(res, "Category deleted", {});
      } else {
        throw new Error(`Category not found for the ID: ${category_id}`);
      }
    } catch (error) {
      return helper.error(res, error);
    }
  }
}