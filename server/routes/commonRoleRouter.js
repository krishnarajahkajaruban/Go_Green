const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
    getAllPlantForms
 } = require("../controller/commonRoleController");
 
 //endpoint to get all the pdf details
 router.get("/get-all-plant-progress-form", authMiddleware, getAllPlantForms);

 module.exports = router;