const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path')


exports.authMiddleware = (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Invalid token' });
    }
}


const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

exports.upload = multer({
    storage: storage,
    // limits: { fileSize: 100000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only JPG/PNG files are allowed!');
        }
    }
}).single('image');


