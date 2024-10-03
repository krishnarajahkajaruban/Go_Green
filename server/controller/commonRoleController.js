const User = require("../models/user");
const PlantProgressForm = require("../models/plantProgressForm");

/* view pdf (common for both user and admin) */
const getAllPlantForms = async (req, res) => {
    try {
        // Extract query parameters and user information from the request
        const { page = 1, limit = 10, reqUserId } = req.query;
        const { id, role } = req.user;

        // Parse page and limit as integers
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        // Validate page and limit values
        if (isNaN(parsedPage) || parsedPage <= 0 || isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Page and limit must be positive integers" });
        }

        // Determine the userId based on role and reqUserId
        let userId;
        if (role === "User") {
            userId = id;
        } else if (role === "Admin" && reqUserId) {
            userId = reqUserId;
        }

        // Construct the query object based on userId
        const query = {};
        if (userId) {
            query.userId = userId;
        }

        // Count total documents matching the query
        const totalCount = await PlantProgressForm.countDocuments(query);

        // Calculate the number of documents to skip based on the current page
        const skip = (parsedPage - 1) * parsedLimit;

        // Fetch the form matching the query with pagination
        const allPlantForms = await PlantProgressForm.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parsedLimit)
            .lean()
            .exec();

        // Return 404 if no form are found
        if (allPlantForms.length === 0) {
            return res.status(404).json({ error: "No Plant Progress & Maintenance form found" });
        }

        // Append user details to each form if necessary
        const plantDetailsWithUserDetails = await Promise.all(
            allPlantForms.map(async (plantDetail) => {
                if (role === "Admin" && !reqUserId && plantDetail.userId) {
                    const user = await User.findById(plantDetail.userId).select("-password").lean().exec();
                    if (user) {
                        plantDetail.user = user;
                    }
                } else if (role === "User" || (reqUserId && role === "Admin")) {
                    const user = await User.findById(userId).select("-password").lean().exec();
                    plantDetail.user = user;
                }
                return plantDetail;
            })
        );

        // Return the fetched forms along with pagination details
        return res.status(200).json({
            currentPage: parsedPage,
            totalPages: Math.ceil(totalCount / parsedLimit),
            totalCount,
            data: plantDetailsWithUserDetails,
        });
    } catch (err) {
        // Return 500 if an error occurs
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    getAllPlantForms
};
