const helper = require("../helpers/helper");
const Vendor = require("../models/Vendor");

module.exports = {
  getVendorsList: async (req, res) => {
    const searchQuery = req.body.vendor_name;
    try {
      let allCount = await Vendor.estimatedDocumentCount();
      let page = +req.query.page && +req.query.page > 0 ? +req.query.page : 1;
      let limit = req.query.limit ? +req.query.limit : 10;
      let offset = limit * (page - 1);

      if (!searchQuery) {
        let findData = await Vendor.find()
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 });
        return helper.success(res, "Data fetched successfully", {
          count: allCount,
          data: findData,
          // all:allData
        });
      } else {
        let findData = await Vendor.find({ vendor_name: searchQuery })
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
  addEditVendor: async (req, res) => {
    try {
      if (req.body._id && req.body._id != "") {
        let searchFilter = {
          vendor_name: { $regex: `^${req.body.vendor_name}$`, $options: "i" },
          _id: {
            $ne: req.body._id,
          },
        };
        let findAny = await Vendor.findOne(searchFilter);
        if (findAny) {
          if (req.body.is_image_uploaded == 1) {
            await fs.unlinkSync(
              path.join(
                __dirname,
                "../../public/uploads/vendors/",
                req.body.image
              )
            );
          }
          throw "Name already in use";
        }
        delete req.body.is_image_uploaded;
        await Vendor.updateOne({ _id: req.body._id }, req.body);
        return helper.success(res, "Vendor updated successfully", {});
      } else {
        delete req.body._id;

        let searchFilter = {
          vendor_name: { $regex: `^${req.body.vendor_name}$`, $options: "i" },
        };

        let findAny = await Vendor.findOne(searchFilter);

        if (findAny) {
          if (req.body.is_image_uploaded == 1) {
            await fs.unlinkSync(
              path.join(__dirname, "../public/uploads/vendors/", req.body.image)
            );
          }
          throw "Name already in use";
        }
        delete req.body.is_image_uploaded;

        await Vendor.create(req.body);
        return helper.success(res, "Vendor created successfully", {});
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
  deleteMe: async (req, res) => {
    try {
      const vendor_id = req.params._id;
      const findByIdAndDelete = await Vendor.findByIdAndDelete(vendor_id);
      if (findByIdAndDelete) {
        return helper.success(res, "Vendor deleted", {});
      } else {
        throw new Error(`Vendor not found for the ID: ${vendor_id}`);
      }
    } catch (error) {
      return helper.error(res, error);
    }
  },
};
