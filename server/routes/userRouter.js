const router = require("express").Router();
const Multer = require("multer");

const { 
    uploadPlantProgressForm,
    updatePlantProgressAndMaintenanceForm,
    deleteProgressForm
 } = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

 const storage = new Multer.memoryStorage();
 const upload = Multer({
   storage,
 });

 //endpoint to upload plant progress maintenance form
router.post("/upload-plant-progress-maintenance-form", upload.single("plant"), uploadPlantProgressForm);

//endpoint to update plant progress maintenance form
router.put("/update-plant-progress-maintenance-form/:formId", authMiddleware, upload.single("plant"), updatePlantProgressAndMaintenanceForm);

//endpoint to delete plant progress maintenance form
 router.delete("/delete-plant-progress-maintenance-form/:formId", authMiddleware, deleteProgressForm);

 module.exports = router;