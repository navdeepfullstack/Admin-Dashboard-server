const helper = require("../helpers/helper");
const Product = require("../models/Product");

module.exports = {
  addEditProduct: async (req, res) => {
    try {
      if (req.body._id && req.body._id != "") {
        let searchFilter = {
          product_name: { $regex: `^${req.body.product_name}$`, $options: "i" },
          _id: {
            $ne: req.body._id,
          },
        };
        let findAny = await Product.findOne(searchFilter);
        if (findAny) {
          if (req.body.is_image_uploaded == 1) {
            await fs.unlinkSync(
              path.join(
                __dirname,
                "../../public/uploads/products/",
                req.body.image
              )
            );
          }
          throw "Name already in use";
        }
        delete req.body.is_image_uploaded;
        const update = await Product.updateOne({ _id: req.body._id }, req.body);
        return helper.success(res, "Product updated successfully", {
          product: update,
        });
      } else {
        delete req.body._id;

        let searchFilter = {
          product_name: { $regex: `^${req.body.product_name}$`, $options: "i" },
        };

        let findAny = await Product.findOne(searchFilter);

        if (findAny) {
          if (req.body.is_image_uploaded == 1) {
            await fs.unlinkSync(
              path.join(
                __dirname,
                "../public/uploads/products/",
                req.body.image
              )
            );
          }
          throw "Name already in use";
        }
        delete req.body.is_image_uploaded;

        const add = await Product.create(req.body);
        return helper.success(res, "Product created successfully", {});
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },

  getProductsList: async (req, res) => {
    const searchQuery = req.body.product_name;

    try {
      const allCount = await Product.estimatedDocumentCount();
      let page = +req.query.page && +req.query.page > 0 ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);

      if (!searchQuery) {
        let findData = await Product.find()
          .populate("category")
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: findData,
          // all:allData
        });
      } else {
        let findData = await Product.find({ product_name: searchQuery })
          .populate("category")
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
  deleteMe: async (req, res) => {
    try {
      const _id = req.params._id;
      const findByIdAndDelete = await Product.findByIdAndDelete(_id);
      if (findByIdAndDelete) {
        return helper.success(res, "Product deleted", {});
      } else {
        throw new Error(`Product not found for the ID: ${vendor_id}`);
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  changeFeature: async (req, res) => {
    try {
      const { product_id, is_featured } = req.body;

      const updateProductFeature = await Product.findByIdAndUpdate(product_id, {
        is_featured: is_featured,
      });
      return helper.success(res, "Feature updated", {updateProductFeature});
    } catch (error) {
      return helper.error(res, error);
    }
  },
};
