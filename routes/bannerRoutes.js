const express = require("express");
 
const router = express.Router();
const { authenticateUser } = require("../passport/index");
const bannerController = require("../controllers/bannerController");
 




router.get("/list", bannerController.bannerList);
router.delete("/delete/:id", bannerController.deleteBanner);
router.post("/addEdit",  bannerController.addEditBanner);

module.exports = router;
