const multer = require('multer');
const path = require('path');

/**
 * Storage configuration for images
 */
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'images')); // Store images in 'uploads/images'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * Storage configuration for resumes
 */
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'resumes')); // Store resumes in 'uploads/resumes'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const notesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'notes')); // Store notes in 'uploads/notes'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
/**
 * File filter for images (allow only jpg, jpeg, png)
 */
const imageFileFilter = (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error('Only JPG, JPEG, and PNG images are allowed!'));
    }
};

/**
 * File filter for resumes (allow only pdf, doc, docx)
 */
const resumeFileFilter = (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
  
    console.log('File Extension:', extname);
    console.log('MIME Type:', mimetype);
  
    if (fileTypes.test(extname) && fileTypes.test(mimetype)) {
      return cb(null, true);
    } else {
      // Pass the error message to callback
        req.fileValidationError = 'Only PDF, DOC, and DOCX files are allowed!';
        return cb(null, false, new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  };
  
const notesFileFilter = (req, file, cb) => {
    const fileTypes = /pdf|jpg|docx|png|doc/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
  
    console.log('File Extension:', extname);
    console.log('MIME Type:', mimetype);
  
    if (fileTypes.test(extname) && fileTypes.test(mimetype)) {
      return cb(null, true);
    } else {
      // Pass the error message to callback
        req.fileValidationError = 'Only PDF,JPG,PNG, DOC, and DOCX files are allowed!';
        return cb(null, false, new Error('Only PDF, JPG,PNG,DOC, and DOCX files are allowed!'));
    }
  };
/**
 * Multer upload configurations
 */
const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
    fileFilter: imageFileFilter
});

const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for resumes
    fileFilter: resumeFileFilter
});
const uploadNotes = multer({
    storage: notesStorage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 10MB limit for resumes
    fileFilter: notesFileFilter
});

module.exports = {
    uploadImage,
    uploadResume,
    uploadNotes
};
