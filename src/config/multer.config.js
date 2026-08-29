import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, '../../uploads');

const usersPath = path.join(uploadsPath, 'users');
const receiptsPath = path.join(uploadsPath, 'receipts');

fs.mkdirSync(usersPath, { recursive: true });
fs.mkdirSync(receiptsPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadType = req.uploadType;

        if (uploadType === 'user-document') {
            return cb(null, usersPath);
        }

        if (uploadType === 'receipt') {
            return cb(null, receiptsPath);
        }

        cb(new Error('INVALID_UPLOAD_TYPE'));
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${extension}`;

        cb(null, uniqueName);
    }
});

const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png'
];

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('INVALID_FILE_TYPE'));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter
});

export default upload;