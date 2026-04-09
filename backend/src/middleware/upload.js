import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import fs from 'fs';

// Define the path for uploads
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Configure Disk Storage
const storage = multer.diskStorage({
  // Tell Multer where to save the files
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  // Create a unique filename for each file
  filename: (req, file, cb) => {
    const uniqueId = nanoid(10); // Create a 10-char unique ID
    const extension = path.extname(file.originalname); // Get the original file extension
    cb(null, `${uniqueId}${extension}`);
  },
});

// 2. Create a File Filter (Optional but recommended)
const fileFilter = (req, file, cb) => {
  // Only accept common image types
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true); // Accept the file
  } else {
    // Reject the file
    cb(new Error('Invalid file type. Only JPEG, PNG, or GIF allowed.'), false);
  }
};

// 3. Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  }
});

export default upload;