const User = require("../models/user");

// /* find all users */
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.user;

        // Check if the user is an Admin
        if (role !== "Admin") {
            return res.status(403).json({ error: "You are not authorized" });
        }

        // // Ensure the name field is provided in the request body
        // const { name } = req.query;
        // if (!name) {
        //     return res.status(200).json([]);
        // }

        // // Create a case-insensitive regex for the name search
        // const nameRegex = new RegExp(`^${name}`, "i");

        // Fetch users matching the query with pagination and only necessary fields
        const allUsers = await User.find({  role: "User" })
            .select("name _id")
            .lean()
            .exec();

        // If no users are found, return an empty array
        if (allUsers.length === 0) {
            return res.status(200).json([]);
        }

        // Map users to include only userId and name
        const userWithNameAndId = allUsers.map(user => ({
            userId: user._id,
            name: user.name,
        }));

        // Return the fetched users
        return res.status(200).json(userWithNameAndId);

    } catch (err) {
        // Return 500 if an error occurs
        return res.status(500).json({ error: err.message });
    }
};

module.exports = getAllUsers;



module.exports = {
    getAllUsers,
};