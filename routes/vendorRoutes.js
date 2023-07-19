const express = require('express');
const authAdminController = require('../controllers/authAdminController');
const vendorController = require('../controllers/vendorController');
 
const router = express.Router();
 

 
router.get("/list", vendorController.getVendorsList)
router.post('/addEdit',vendorController.addEditVendor) 
router.delete("/delete/:_id",  vendorController.deleteMe);
 










module.exports = router;
