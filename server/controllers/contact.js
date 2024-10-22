const nodemailer = require("nodemailer");
const path = require("path");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendContactMessage(req, res) {
    const { name, email, message } = req.body;
    const from = email;

    const mailOptions = {
        from: from,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; padding: 20px;">
                <h2 style="color: #333; font-size: 2rem;">Electronic Voting System (EVS)</h2>
                <h2 style="color: #333; font-size: 1.5rem;">New Contact Form Submission</h2>
                <div style="max-width: 600px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 1rem;"><strong>Name:</strong> ${name}</p>
                    <p style="font-size: 1rem;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 1rem;"><strong>Message:</strong></p>
                    <p style="font-size: 1rem;">${message}</p>
                    <img src="cid:logo" alt="EVS" style="width: 90px; height: auto; margin: 1.5rem 0;">
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
            return res.status(500).send(error.toString());
        }
        res.status(200).send("Email sent: " + info.response);
    });
}

module.exports = { sendContactMessage };
