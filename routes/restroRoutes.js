const express = require('express');
const authAdminController = require('../controllers/authAdminController');
const restaurantController = require('../controllers/restaurantController');
 
 
const router = express.Router();
 

 
router.get("/list", restaurantController.restaurantList)
router.post('/addEdit',restaurantController.addEditRestro) 
router.delete("/delete/:_id",  restaurantController.deleteRestro);
 










module.exports = router;
