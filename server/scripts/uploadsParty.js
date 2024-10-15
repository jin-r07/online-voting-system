const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads/parties");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const partyName = req.body.name.replace(/\s+/g, '_');
        const extension = path.extname(file.originalname);
        const newFileName = `${partyName}${extension}`;
        
        const existingFiles = fs.readdirSync(uploadDir).filter(f => f.startsWith(partyName));

        if (existingFiles.length > 0) {
            existingFiles.forEach(file => {
                const filePath = path.join(uploadDir, file);
                fs.unlinkSync(filePath);
            });
        }

        cb(null, newFileName);
    }
});

const upload = multer({ storage });

module.exports = upload;
