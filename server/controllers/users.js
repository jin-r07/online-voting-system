const User = require("../models/users");

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        const usersWithImageURLs = users.map(user => {
            return {
                ...user.toObject(),
                voterIdCardPicture: `http://localhost:8080/uploads/users/${user.voterIdCardPicture.split('\\').pop()}`
            };
        });
        res.status(200).json(usersWithImageURLs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching users" });
    }
}

async function editUser(req, res) {
    const { id } = req.params;
    const { email, voterIdCardNumber, role } = req.body;
    let voterIdCardPicture;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if a new file is uploaded
        if (req.file) {
            voterIdCardPicture = req.file.path; // Get the path of the uploaded file
        } else {
            voterIdCardPicture = user.voterIdCardPicture; // Keep the existing path
        }

        // Update user details
        user.email = email;
        user.voterIdCardPicture = voterIdCardPicture; // Use the correct picture path
        user.voterIdCardNumber = voterIdCardNumber;
        user.role = role;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating user" });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting user" });
    }
}

module.exports = { getAllUsers, editUser, deleteUser };
