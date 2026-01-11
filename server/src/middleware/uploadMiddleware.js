import multer from "multer";
import path from "path";
import fs from "fs";

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/";
        if (file.fieldname === "profileImage") {
            folder += "profiles";
        } else if (file.fieldname === "resume") {
            folder += "resumes";
        }

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const userId = req.user ? req.user._id : "guest";
        cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// File Filters
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "profileImage") {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed for profile pictures."), false);
        }
    } else if (file.fieldname === "resume") {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.oasis.opendocument.text", // Support ODT just in case
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid resume format (${file.mimetype}). Only PDF and ODT allowed.`), false);
        }
    } else {
        cb(new Error("Unexpected field."), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

export default upload;
