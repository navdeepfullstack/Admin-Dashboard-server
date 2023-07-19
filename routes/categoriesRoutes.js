const express = require("express");
const multer = require("multer");
const router = express.Router();
const { authenticateUser } = require("../passport/index");
const categoriesController = require("../controllers/categoriesController");




router.get("/list", categoriesController.categoryList);
router.delete("/delete/:category_id", categoriesController.deleteCategory);
router.post("/addEdit",  categoriesController.addEditCategory);

module.exports = router;
