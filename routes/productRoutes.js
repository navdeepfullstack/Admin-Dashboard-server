const express = require('express');
const authAdminController = require('../controllers/authAdminController');
const productController = require('../controllers/productController');
 
 
const router = express.Router();
 

 
router.get("/list", productController.getProductsList)
router.post('/addEdit',productController.addEditProduct) 
router.delete("/delete/:_id",  productController.deleteMe);
router.put("/feature",  productController.changeFeature);

 










module.exports = router;
