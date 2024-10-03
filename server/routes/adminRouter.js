const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
    getAllUsers
 } = require("../controller/adminController");
 
 //endpoint to get all users
 router.get("/get-all-users", authMiddleware, getAllUsers);

 module.exports = router;