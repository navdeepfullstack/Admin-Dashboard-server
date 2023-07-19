const express = require('express');
const authAdminController = require('../controllers/authAdminController');
 
const router = express.Router();
 

 
router.post("/login", authAdminController.login)
router.post("/uploadImage", authAdminController.uploadImage)
router.get("/dashboard", authAdminController.dashboard)
router.post("/multiple", authAdminController.uploadMultipleImages)


 










module.exports = router;
