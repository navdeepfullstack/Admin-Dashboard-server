const express = require("express");

const router = express.Router();
 const {authenticateUser} = require('../passport/index');
const usersController = require("../controllers/usersController");

router.get("/userList", usersController.userList);
router.delete("/delete/:user_id", usersController.deleteUser);
router.post("/addUser", usersController.addUser);
router.put("/editUser", usersController.editUser);


module.exports = router;
