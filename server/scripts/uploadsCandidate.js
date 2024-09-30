const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads/candidates");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Use the voterIdCardNumber from the request body as the filename
        const voterIdCardNumber = req.body.voterIdCardNumber;
        const extension = path.extname(file.originalname);
        cb(null, `${voterIdCardNumber}${extension}`);
    }
});

const upload = multer({ storage });

module.exports = upload;