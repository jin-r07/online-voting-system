const fs = require("fs");
const User = require("../models/user");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
    try {
        const { email, voterIdCardNumber, password } = req.body;
        const voterIdCardPicture = req.file ? req.file.path : '';

        const existingUser = await User.findOne({
            $or: [{ voterIdCardNumber }, { email }]
        });

        if (existingUser) {
            if (voterIdCardPicture) {
                fs.unlinkSync(voterIdCardPicture);
            }

            let errorMessage = '';
            if (existingUser.voterIdCardNumber === voterIdCardNumber && existingUser.email === email) {
                errorMessage = "User with this Voter ID and email already exists.";
            } else if (existingUser.voterIdCardNumber === voterIdCardNumber) {
                errorMessage = "User with this Voter ID already exists.";
            } else if (existingUser.email === email) {
                errorMessage = "User with this email already exists.";
            }
            return res.status(409).json({ message: errorMessage });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            voterIdCardPicture,
            voterIdCardNumber,
            password: hashPassword,
            role: "user"
        });

        const saveUser = await newUser.save();
        res.status(201).json({ message: "User created successfully.", user: saveUser });
    } catch (err) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: err.message });
    }
}

module.exports = { registerUser };
