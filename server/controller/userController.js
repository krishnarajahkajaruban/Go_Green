const { generateToken, decodeToken } = require("../common/jwt");
const { register, login } = require("./authController");
const dotenv = require('dotenv');
const handleUpload = require("../utils/cloudinaryUtils");
const PlantProgressForm = require("../models/plantProgressForm");

// // Load environment variables from .env file
dotenv.config();

/* create a document for an order */
const uploadPlantProgressForm = async (req, res) => {
    try {
        const { email, name, password, school, grade, accessToken, registeredStatus, role, plantName, issueDate, year, progressAndMaintenance } = req.body;
        let user;
        let token;

        const handleAuthorization = async () => {
            if (accessToken) {
                try {
                    user = await decodeToken(accessToken, process.env.JWT_SECRET);
                    if (!user) return { status: 404, error: "User not found" };
                    if (user.role !== "User") return { status: 403, error: "User is not authorized to upload Plant Progress & Maintenance Form" };
                    token = accessToken;
                } catch (error) {
                    return { status: 401, error: "Invalid token" };
                }
            } else if (registeredStatus) {
                const result = await login(email, password);
                if (result.status !== 200) return { status: result.status, error: result.error };
                user = result.user;
                if (user.role !== "User") return { status: 403, error: "User is not authorized to upload Plant Progress & Maintenance Form" };
                token = result.token;
            } else {
                if (role !== "User") return { status: 403, error: "User is not authorized to upload Plant Progress & Maintenance Form" };
                const result = await register(email, name, password, role, school, grade);
                if (result.status !== 201) return { status: result.status, error: result.error };
                user = result.user;
                token = generateToken(user, process.env.JWT_SECRET);
            }
            return { status: 200 };
        };

        const authResult = await handleAuthorization();
        if (authResult.status !== 200) {
            return res.status(authResult.status).json({ error: authResult.error });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No Photo provided" });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const cldRes = await handleUpload(dataURI);

        const newPlantProgressAndMaintenanceForm = new PlantProgressForm({
            userId: user.id || user._id,
            plantDetail: {
                plantName,
                issueDate
            },
            progressAndMaintenance: {
                year,
                progressAndMaintenance,
                photoUrl: cldRes.secure_url
            }
        });

        await newPlantProgressAndMaintenanceForm.save();

        return res.status(201).json({
            message: 'Plant Progress & Maintenance Form uploaded successfully!',
            form: newPlantProgressAndMaintenanceForm.toObject(),
            user,
            token
        });

    } catch (error) {
        console.error(error); // Log the error to console for debugging
        return res.status(500).json({ error: "Internal server error" });
    }
};

/* edit uploaded plant progress document */
const updatePlantProgressAndMaintenanceForm = async (req, res) => {
    try {
        const { plantName, issueDate, year, progressAndMaintenance } = req.body;
        const { formId } = req.params;
        const { role, id } = req.user;

        if(role !== "User") {
            return res.status(403).json({ error: "User is not authorized to update Plant Progress & Maintenance Form" }); 
        };

        if (!formId) {
            return res.status(400).json({ error: "Plant Progress & Maintenance Form Id is required." });
        }

        const formToBeModified = await PlantProgressForm.findById(formId);

        if (!formToBeModified) {
            return res.status(404).json({ error: "Plant Progress & Maintenance Form not found" });
        }

        let photoUrl = formToBeModified.progressAndMaintenance.photoUrl;
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const cldRes = await handleUpload(dataURI);
            photoUrl = cldRes.secure_url;
        }

        const updatedFields = {
            plantDetail: {},
            progressAndMaintenance: {}
        };

        if (plantName || issueDate) {
            updatedFields.plantDetail.plantName = plantName || formToBeModified.plantDetail.plantName;
            updatedFields.plantDetail.issueDate = issueDate || formToBeModified.plantDetail.issueDate;
        }

        if (year || progressAndMaintenance || req.file) {
            updatedFields.progressAndMaintenance.year = year || formToBeModified.progressAndMaintenance.year;
            updatedFields.progressAndMaintenance.progressAndMaintenance = progressAndMaintenance || formToBeModified.progressAndMaintenance.progressAndMaintenance;
            updatedFields.progressAndMaintenance.photoUrl = photoUrl;
        }

        const updatedForm = await PlantProgressForm.findOneAndUpdate(
            { _id: formId, userId: id},
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ error: "Error in updating Plant Progress & Maintenance Form" });
        }

        return res.status(200).json({
            message: 'Plant Progress & Maintenance Form updated successfully!',
            form: updatedForm.toObject()
        });

    } catch (error) {
        console.error(error); // Log the error to console for debugging
        return res.status(500).json({ error: "Internal server error" });
    }
};

/* delete the uploaded plant progress form */
const deleteProgressForm = async (req, res) => {
    try {
        const { formId } = req.params;
        const { role, id } = req.user;

        if (!formId) {
            return res.status(400).json({ error: "Plant Progress & Maintenance Form Id is required." });
        }

        if (role !== "User") {
            return res.status(403).json({ error: "User is not authorized to delete Plant Progress & Maintenance Form" });
        }

        const deletionResult = await PlantProgressForm.deleteOne({ _id: formId, userId: id });

        if (deletionResult.deletedCount === 0) {
            return res.status(404).json({ error: "Plant Progress & Maintenance Form not found" });
        }

        res.status(200).json({ message: "Plant Progress & Maintenance Form deleted successfully" });
    } catch (error) {
        console.error(error); // Log the error to console for debugging
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    uploadPlantProgressForm,
    updatePlantProgressAndMaintenanceForm,
    deleteProgressForm
};


