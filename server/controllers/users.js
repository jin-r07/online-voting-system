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

        if (req.file) {
            voterIdCardPicture = req.file.path;
        } else {
            voterIdCardPicture = user.voterIdCardPicture;
        }

        user.email = email;
        user.voterIdCardPicture = voterIdCardPicture;
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
