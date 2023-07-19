const express = require('express');
const authAdminController = require('../controllers/authAdminController');
const dishesController = require('../controllers/dishesController');

 
 
const router = express.Router();
 

 
router.get("/list/:_id", dishesController.DishesList)
router.post('/addEdit',dishesController.addEditDish) 
router.delete("/delete/:_id",  dishesController.deleteMe);
 










module.exports = router;
