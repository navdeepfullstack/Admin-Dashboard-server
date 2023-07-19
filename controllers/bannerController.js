const helper = require("../helpers/helper");
const path = require("path");
const fs = require("fs");
const Banner = require("../models/Banner");
module.exports = {
  addEditBanner: async (req, res) => {
    try {
      if (req.body._id && req.body._id != "") {
        let searchFilter = {
          _id: {
            $ne: req.body._id,
          },
        };
        const findAny = await Banner.findOne(searchFilter);
        console.log(findAny);
          // if (findAny) {
          //   if (req.body.is_image_uploaded == 1) {
          //     await fs.unlinkSync(
          //       path.join(
          //         __dirname,
          //         "../public/uploads/banners/",
          //         req.body.image
          //       )
          //     );
          //   }
          // }
        delete req.body.is_image_uploaded;

        await Banner.updateOne({ _id: req.body._id }, req.body);
        return helper.success(res, "Banner updated successfully", {});
      } else {
        delete req.body._id;
        // if (req.body.is_image_uploaded == 1) {
        //   await fs.unlinkSync(
        //     path.join(
        //       __dirname,
        //       "../public/uploads/banner/",
        //       req.body.image
        //     )
        //   );
        // }
        delete req.body.is_image_uploaded;

        await Banner.create(req.body);
        return helper.success(res, "Banner created successfully", {});
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },

  bannerList: async (req, res) => {
    try {
      let allCount = await Banner.estimatedDocumentCount();
      let page = +req.query.page && +req.query.page > 0 ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);

      let findData = await Banner.find()
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });

      return helper.success(res, "Data fetched successfully", {
        count: allCount,
        data: findData,
      });
    } catch (error) {
      return helper.error(res, error);
    }
  },

  deleteBanner: async (req, res) => {
    try {
      const id = req.params.id;
      const find = await Banner.findByIdAndDelete(id);
      if (find) {
        return helper.success(res, "Benner Deleted", {});
      } else {
        throw "Banner ID mismacth.";
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
};
