const crypto = require("crypto");
const nodemailer = require("nodemailer");
const OTP = require("../models/otp");
const User = require("../models/users");
const path = require("path");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOtp(req, res) {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expires = Date.now() + 5 * 60 * 1000;

        await OTP.findOneAndUpdate(
            { email },
            { otp, expires },
            { upsert: true, new: true }
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Electronic Voting System (EVS), Action Required: One-Time Verification Code",
            text: `Your OTP code is ${otp}.`,
            html: `
                <div style="text-align: center;">
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 90%; max-width: 40rem; text-align: center; padding: 2rem; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <img src="cid:logo" alt="EVS" style="width: 90px; height: auto; margin: 1.5rem 0;">
                        <h2 style="color: #333;">Action Required: One-Time Verification Code</h2>
                        <p style="font-size: 1rem;">You are receiving this email because a request was made for a one-time code that can be used for authentication.</p>
                        <p style="font-size: 1rem;">Please enter the following code for verification:</p>
                        <p style="font-size: 1.5rem; color: #007bff;">${otp}</p>
                        <p style="font-size: 1rem;">If you did not request this, you can ignore and delete it. Thank you for understanding.</p>
                        <p style="font-size: 0.8rem; color: #999090; margin-top: 2.5rem;">This message was sent from Electronic Voting System (EVS).</p>
                    </div>
                </div>
            `,
            attachments: [{
                filename: "logo.png",
                path: path.join(__dirname, "logo.png"),
                cid: "logo"
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Failed to send OTP." });
            }

            res.status(200).json({ message: "OTP sent to your email." });
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP." });
    }
}

async function verifyOtp(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required." });
    }

    try {
        const storedOtp = await OTP.findOne({ email });

        if (!storedOtp) {
            return res.status(400).json({ message: "OTP not found for this email." });
        }

        if (Date.now() > storedOtp.expires) {
            await OTP.deleteOne({ email });
            return res.status(400).json({ message: "OTP has expired." });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        await OTP.deleteOne({ email });
        res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}

module.exports = { sendOtp, verifyOtp };
