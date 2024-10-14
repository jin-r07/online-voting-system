const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads/users");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const voterIdCardNumber = req.body.voterIdCardNumber;
        console.log(`Uploading file with voter ID: ${voterIdCardNumber}`);
        const extension = path.extname(file.originalname);
        cb(null, `${voterIdCardNumber}${extension}`);
    }
});

const upload = multer({ storage });

module.exports = upload;